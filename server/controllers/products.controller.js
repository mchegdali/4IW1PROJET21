const httpErrors = require('http-errors');
const validator = require('validator');
const { connection, Products } = require('../models/sql');
const CategoriesMongo = require('../models/mongo/categories.mongo');
const ProductMongo = require('../models/mongo/products.mongo');
const {
  productCreateSchema,
  productQuerySchema,
  productUpdateSchema,
} = require('../schemas/products.schema');
const { NotFound } = httpErrors;

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function createProduct(req, res, next) {
  try {
    const productCreateBody = await productCreateSchema.parseAsync(req.body);

    const result = await connection.transaction(async (t) => {
      if (productCreateBody.categoryId) {
        const category = await CategoriesMongo.findById(
          productCreateBody.categoryId,
        );

        if (!category) {
          throw new NotFound('Catégorie introuvable');
        }
      }

      const data = await Products.create(productCreateBody, {
        transaction: t,
        include: ['category'],
      });

      throw new Error('test');

      const newData = await Products.scope('toMongo').findByPk(data.id, {
        transaction: t,
      });
      const product = newData.get({
        plain: true,
      });

      const productDoc = await ProductMongo.create(product);

      return productDoc;
    });

    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getProducts(req, res, next) {
  try {
    const category = req.params.category;
    const categoryIsUUID = res.locals.category?.isUUID;

    const { page, text, limit } = await productQuerySchema.parseAsync(
      req.query,
    );

    if (category) {
      const categoryDoc = await CategoriesMongo.findOne({
        [categoryIsUUID ? '_id' : 'slug']: category,
      });

      if (!categoryDoc) {
        return res.sendStatus(404);
      }
    }

    /**
     * @type {import('mongoose').PipelineStage[]  }
     */
    const pipelineStages = [];
    /**
     * @type {import('mongoose').PipelineStage  }
     */
    let textMatchStage;

    /**
     * @type {import('mongoose').PipelineStage  }
     */
    let categoryMatchStage;

    /**
     * @type {import('mongoose').PipelineStage  }
     */
    let sortStage;

    if (category) {
      categoryMatchStage = {
        $match: {
          [categoryIsUUID ? 'category._id' : 'category.slug']: category,
        },
      };
    }

    // if (true) {
    if (text) {
      textMatchStage = {
        $match: {
          $text: {
            $search: text,
            $diacriticSensitive: false,
            $caseSensitive: false,
          },
        },
      };
      sortStage = {
        $sort: { score: { $meta: 'textScore' } },
      };
    }

    if (categoryMatchStage) {
      pipelineStages.push(categoryMatchStage);
    }
    if (textMatchStage) {
      pipelineStages.push(textMatchStage);
    }

    pipelineStages.push(
      { $skip: (page - 1) * limit },
      { $project: { score: 0 } },
      {
        $facet: {
          metadata: [
            { $count: 'total' },
            {
              $addFields: {
                page,
                totalPages: { $ceil: { $divide: ['$total', limit] } },
              },
            },
          ],
          data: [{ $set: { price: { $toString: '$price' } } }],
        },
      },
    );

    if (sortStage) {
      pipelineStages.push(sortStage);
    }

    const products = await ProductMongo.aggregate(pipelineStages).exec();

    return res.json({
      metadata: products[0].metadata[0],
      data: products[0].data,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getProduct(req, res, next) {
  try {
    const isUUID = validator.isUUID(req.params.product);

    const filter = {
      [isUUID ? '_id' : 'slug']: req.params.product,
    };

    const product = await ProductMongo.findOne(filter);
    if (!product) {
      return res.sendStatus(404);
    }
    return res.json(product);
  } catch (error) {
    return next(error);
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getRelatedProducts(req, res, next) {
  try {
    const isUUID = validator.isUUID(req.params.product);

    const filter = {
      [isUUID ? '_id' : 'slug']: req.params.product,
    };

    const product = await ProductMongo.findOne(filter);
    if (!product) {
      return res.sendStatus(404);
    }

    const relatedProducts = await ProductMongo.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(5);

    return res.status(200).json(relatedProducts);
  } catch (error) {
    return next(error);
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function updateProduct(req, res, next) {
  try {
    const isUUID = validator.isUUID(req.params.product);
    const sqlWhere = {
      [isUUID ? 'id' : 'slug']: req.params.product,
    };
    const mongoWhere = {
      [isUUID ? '_id' : 'slug']: req.params.product,
    };

    const productUpdateBody = await productUpdateSchema.parseAsync(req.body);
    const updatedKeys = Object.keys(productUpdateBody);

    const result = await connection.transaction(async (t) => {
      const [affectedRowsCount, affectedRows] = await Products.update(
        productUpdateBody,
        {
          where: sqlWhere,
          limit: 1,
          transaction: t,
          returning: true,
        },
      );

      if (affectedRowsCount === 0) {
        throw new NotFound('Produit introuvable');
      }

      const product = await Products.scope('toMongo').findByPk(
        affectedRows[0].getDataValue('id'),
        {
          transaction: t,
        },
      );

      const productMongo = {};

      for (const key of updatedKeys) {
        productMongo[key] = product.getDataValue(key);
      }

      const replaceResult = await ProductMongo.findOneAndUpdate(
        mongoWhere,
        productMongo,
        {
          new: true,
        },
      );

      if (!replaceResult) {
        throw new NotFound('Produit introuvable');
      }

      return replaceResult;
    });

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function deleteProduct(req, res, next) {
  try {
    const isUUID = validator.isUUID(req.params.product);

    const sqlWhere = {
      [isUUID ? 'id' : 'slug']: req.params.product,
    };
    const mongoWhere = {
      [isUUID ? '_id' : 'slug']: req.params.product,
    };

    const [deletedCountSql, deletedCountMongo] = await Promise.all([
      Products.destroy({ where: sqlWhere }),
      ProductMongo.deleteOne(mongoWhere),
    ]);

    if (deletedCountSql === 0 && deletedCountMongo.deletedCount === 0) {
      return res.sendStatus(404);
    }

    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  getRelatedProducts,
  updateProduct,
  deleteProduct,
};
