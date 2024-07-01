const CategoriesSequelize = require('../models/sql/categories.sql');
const CategoriesMongo = require('../models/mongo/categories.mongo');
const sequelize = require('../models/sql/db');
const { NotFound } = require('http-errors');
const ProductMongo = require('../models/mongo/products.mongo');

const {
  categoryCreateSchema,
  categoryUpdateSchema,
} = require('../schemas/categories.schema');

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function createCategory(req, res, next) {
  try {
    const categoryCreateBody = await categoryCreateSchema.parseAsync(req.body);
    const result = await sequelize.transaction(async (t) => {
      const product = await CategoriesSequelize.create(categoryCreateBody, {
        transaction: t,
      });

      const categoryDoc = await CategoriesMongo.create({
        _id: product.id,
        name: product.name,
        slug: product.slug,
      });

      return categoryDoc;
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
async function getCategories(req, res, next) {
  try {
    const categories = await CategoriesMongo.find({}).lean({});
    return res.json(categories);
  } catch (error) {
    return next(error);
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getCategory(req, res, next) {
  try {
    /**
     * @type {boolean}
     */
    const isUUID = res.locals.category.isUUID;

    const filter = {
      [isUUID ? '_id' : 'slug']: req.params.category,
    };

    const category = await CategoriesMongo.findOne(filter).lean();

    if (!category) {
      return res.sendStatus(404);
    }

    return res.json(category);
  } catch (error) {
    return next(error);
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function updateCategory(req, res, next) {
  try {
    const isUUID = res.locals.category.isUUID;
    const sqlWhere = {
      [isUUID ? 'id' : 'slug']: req.params.category,
    };
    const mongoWhere = {
      [isUUID ? '_id' : 'slug']: req.params.category,
    };

    const categoryUpdateBody = categoryUpdateSchema.parse(req.body);
    const updatedKeys = Object.keys(categoryUpdateBody);

    const result = await sequelize.transaction(async (t) => {
      const [affectedRowsCount, affectedRows] =
        await CategoriesSequelize.update(categoryUpdateBody, {
          where: sqlWhere,
          limit: 1,
          transaction: t,
          returning: true,
        });

      if (affectedRowsCount === 0) {
        throw new NotFound();
      }

      const category = await CategoriesSequelize.scope('toMongo').findByPk(
        affectedRows[0].getDataValue('id'),
        {
          transaction: t,
        },
      );

      const categoryMongo = {};

      for (const key of updatedKeys) {
        categoryMongo[key] = category.getDataValue(key);
      }

      const categoryDoc = await CategoriesMongo.findOneAndUpdate(
        mongoWhere,
        categoryMongo,
        {
          new: true,
        },
      );

      if (!categoryDoc) {
        throw new NotFound();
      }

      await ProductMongo.updateMany(
        {
          'category._id': categoryDoc._id,
        },
        {
          $set: {
            category: categoryDoc,
          },
        },
      );

      return categoryDoc;
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
async function deleteCategory(req, res, next) {
  try {
    const isUUID = res.locals.category.isUUID;

    const sqlWhere = {
      [isUUID ? 'id' : 'slug']: req.params.category,
    };
    const mongoWhere = {
      [isUUID ? '_id' : 'slug']: req.params.category,
    };

    const [deletedCountSql, deletedCountMongo] = await Promise.all([
      CategoriesSequelize.destroy({ where: sqlWhere }),
      CategoriesMongo.deleteOne(mongoWhere),
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

    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
