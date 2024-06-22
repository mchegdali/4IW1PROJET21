import ProductsCategoriesSequelize from '../models/sql/products-categories.sql.js';
import ProductsCategoriesMongo from '../models/mongo/products-categories.mongo.js';
import {
  productCategoryCreateSchema,
  productCategoryUpdateSchema,
} from '../schemas/products-categories.schema.js';
import sequelize from '../models/sql/db.js';
import httpErrors from 'http-errors';
import ProductMongo from '../models/mongo/products.mongo.js';
const { NotFound } = httpErrors;
/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
export async function createProductCategory(req, res, next) {
  try {
    const productCategoryCreateBody =
      await productCategoryCreateSchema.parseAsync(req.body);
    const result = await sequelize.transaction(async (t) => {
      const product = await ProductsCategoriesSequelize.create(
        productCategoryCreateBody,
        { transaction: t },
      );

      const productCategoryMongo = {
        _id: product.id,
        name: product.name,
        slug: product.slug,
      };

      const productCategoryDoc =
        await ProductsCategoriesMongo.create(productCategoryMongo);

      return productCategoryDoc;
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
export async function getProductCategories(req, res, next) {
  try {
    const productsCategories = await ProductsCategoriesMongo.find({}).lean({});
    return res.json(productsCategories);
  } catch (error) {
    return next(error);
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
export async function getProductCategory(req, res, next) {
  try {
    /**
     * @type {boolean}
     */
    const isUUID = res.locals.category.isUUID;

    const filter = {
      [isUUID ? '_id' : 'slug']: req.params.category,
    };

    const productCategory =
      await ProductsCategoriesMongo.findOne(filter).lean();

    if (!productCategory) {
      return res.sendStatus(404);
    }

    return res.json(productCategory);
  } catch (error) {
    return next(error);
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
export async function updateProductCategory(req, res, next) {
  try {
    const isUUID = res.locals.category.isUUID;
    const sqlWhere = {
      [isUUID ? 'id' : 'slug']: req.params.category,
    };
    const mongoWhere = {
      [isUUID ? '_id' : 'slug']: req.params.category,
    };

    const productCategoryUpdateBody = productCategoryUpdateSchema.parse(
      req.body,
    );
    const updatedKeys = Object.keys(productCategoryUpdateBody);

    const result = await sequelize.transaction(async (t) => {
      const [affectedRowsCount, affectedRows] =
        await ProductsCategoriesSequelize.update(productCategoryUpdateBody, {
          where: sqlWhere,
          limit: 1,
          transaction: t,
          returning: true,
        });

      if (affectedRowsCount === 0) {
        throw new NotFound('Catégorie introuvable');
      }

      const productCategory = await ProductsCategoriesSequelize.scope(
        'toMongo',
      ).se.findByPk(affectedRows[0].getDataValue('id'), {
        transaction: t,
      });

      const productCategoryMongo = {};

      for (const key of updatedKeys) {
        productCategoryMongo[key] = productCategory.getDataValue(key);
      }

      const productCategoryDoc = await ProductsCategoriesMongo.findOneAndUpdate(
        mongoWhere,
        productCategoryMongo,
        {
          new: true,
        },
      );

      if (!productCategoryDoc) {
        throw new NotFound('Catégorie introuvable');
      }

      await ProductMongo.updateMany(
        {
          'category._id': productCategoryDoc._id,
        },
        {
          $set: {
            category: productCategoryDoc,
          },
        },
      );

      return productCategoryDoc;
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
export async function deleteProductCategory(req, res, next) {
  try {
    const isUUID = res.locals.category.isUUID;

    const sqlWhere = {
      [isUUID ? 'id' : 'slug']: req.params.category,
    };
    const mongoWhere = {
      [isUUID ? '_id' : 'slug']: req.params.category,
    };

    const [deletedCountSql, deletedCountMongo] = await Promise.all([
      ProductsCategoriesSequelize.destroy({ where: sqlWhere }),
      ProductsCategoriesMongo.deleteOne(mongoWhere),
    ]);

    if (deletedCountSql === 0 && deletedCountMongo.deletedCount === 0) {
      return res.sendStatus(404);
    }

    await ProductMongo.updateMany(
      {
        category: mongoWhere,
      },
      {
        $set: {
          category: null,
        },
      },
    );

    return res.status(204).json({ message: 'Catégorie supprimée' });
  } catch (error) {
    return next(error);
  }
}
