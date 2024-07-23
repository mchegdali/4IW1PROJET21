const httpErrors = require('http-errors');
const validator = require('validator');
const sequelize = require('../models/sql');
const CategoriesMongo = require('../models/mongo/categories.mongo');
const { ProductMongo } = require('../models/mongo/products.mongo');
const {
  productCreateSchema,
  productQuerySchema,
  productUpdateSchema,
} = require('../schemas/products.schema');
const { Op } = require('sequelize');

const { NotFound } = httpErrors;
const Products = sequelize.model('products');

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function createProduct(req, res, next) {
  try {
    const productCreateBody = await productCreateSchema.parseAsync({
      ...req.body,
      price: Number(req.body.price), // Conversion de string à number
    });

    if (req.file) {
      productCreateBody.image = req.file.path;
    }

    const result = await sequelize.transaction(async (t) => {
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

      return data;
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

    const { page, text, pageSize, minPrice, maxPrice } =
      productQuerySchema.parse(req.query);

    /**
     * @type {import('mongoose').PipelineStage[]  }
     */
    const pipelineStages = [];

    /**
     * @type {import('mongoose').FilterQuery[]  }
     */
    const matchAndStage = [];

    if (text) {
      matchAndStage.push({
        $text: {
          $search: text,
          $diacriticSensitive: false,
          $caseSensitive: false,
        },
      });
    }

    if (category) {
      matchAndStage.push({
        $or: [{ 'category._id': category }, { 'category.slug': category }],
      });
    }

    if (minPrice || maxPrice) {
      let priceMatch = {};

      if (minPrice) {
        priceMatch['$gte'] = Number(minPrice);
      }

      if (maxPrice) {
        priceMatch['$lte'] = Number(maxPrice);
      }

      matchAndStage.push({
        price: priceMatch,
      });
    }

    if (matchAndStage.length > 0) {
      pipelineStages.push({
        $match: {
          $and: matchAndStage,
        },
      });
    }

    pipelineStages.push(
      { $project: { score: 0 } },
      {
        $facet: {
          metadata: [
            { $count: 'total' },
            {
              $set: {
                page,
                totalPages: { $ceil: { $divide: ['$total', pageSize] } },
                pageSize,
              },
            },
          ],
          data: [
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
              $set: {
                price: { $toString: '$price' },
              },
            },
          ],
        },
      },
    );

    if (text) {
      pipelineStages.push({
        $sort: { score: { $meta: 'textScore' } },
      });
    }

    const products = await ProductMongo.aggregate(pipelineStages).exec();

    return res.json({
      metadata: products[0].metadata[0] ?? {
        total: 0,
        page: 1,
        totalPages: 0,
        pageSize,
      },
      data: products[0].data.map((product) => ({
        ...product,
        id: product._id.toString(),
      })),
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
async function getRecentProducts(req, res, next) {
  try {
    const recentProducts = await ProductMongo.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .exec();

    return res.status(200).json(recentProducts);
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
      'category._id': product.category._id,
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
    const productUpdateBody = productUpdateSchema.parse({
      ...req.body,
      price: Number(req.body.price),
    });

    if (req.file) {
      productUpdateBody.image = req.file.path;
    }

    const [updated, updatedProducts] = await Products.update(
      productUpdateBody,
      {
        where: {
          [Op.or]: [{ id: req.params.product }, { slug: req.params.product }],
        },
        limit: 1,
        returning: true,
        individualHooks: true,
      },
    );

    if (updated) {
      const updatedProduct = await updatedProducts[0].toMongo();
      console.log('updatedProduct renvoyé au front', updatedProduct);
      return res.status(200).json(updatedProduct);
    }

    throw new NotFound('Produit non trouvé');
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error); // Journalisation des erreurs
    next(error);
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function deleteProduct(req, res, next) {
  try {
    const deletedCountSql = await Products.destroy({
      where: {
        [Op.or]: [{ id: req.params.product }, { slug: req.params.product }],
      },
      limit: 1,
      individualHooks: true,
    });

    if (deletedCountSql === 0) {
      return res.sendStatus(404);
    }

    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
}

/**
 * Récupère le nombre total de produits dans Mongo
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getProductCount(req, res, next) {
  try {
    const count = await ProductMongo.countDocuments();
    return res.status(200).json({ count });
  } catch (error) {
    return next(error);
  }
}

/**
 * Récupère la répartition des produits par catégorie
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getProductDistributionByCategory(req, res, next) {
  try {
    const distribution = await ProductMongo.aggregate([
      {
        $group: {
          _id: '$category.name',
          count: { $sum: 1 },
        },
      },
    ]);
    return res.status(200).json(distribution);
  } catch (error) {
    return next(error);
  }
}

/**
 * Récupère la distribution des produits par tranche de prix depuis MongoDB
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getPriceDistribution(req, res, next) {
  try {
    const products = await ProductMongo.find().exec();
    const priceDistribution = [
      { range: 'Moins de 100 €', count: 0 },
      { range: '100 € - 300 €', count: 0 },
      { range: '300 € - 500 €', count: 0 },
      { range: '500 € - 700 €', count: 0 },
      { range: 'Plus de 700 €', count: 0 },
    ];

    products.forEach((product) => {
      const price = parseFloat(product.price);
      if (!isNaN(price)) {
        if (price < 100) {
          priceDistribution[0].count += 1;
        } else if (price >= 100 && price < 300) {
          priceDistribution[1].count += 1;
        } else if (price >= 300 && price < 500) {
          priceDistribution[2].count += 1;
        } else if (price >= 500 && price < 700) {
          priceDistribution[3].count += 1;
        } else if (price >= 700) {
          priceDistribution[4].count += 1;
        }
      } else {
        console.warn(
          `Invalid price for product: ${product.name}, price: ${product.price}`,
        );
      }
    });

    res.status(200).json(priceDistribution);
  } catch (error) {
    console.error('Error in getPriceDistribution:', error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  createProduct,
  getProducts,
  getRecentProducts,
  getProduct,
  getRelatedProducts,
  updateProduct,
  deleteProduct,
  getProductCount,
  getProductDistributionByCategory,
  getPriceDistribution,
};
