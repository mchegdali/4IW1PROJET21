import formatZodError from '../utils/format-zod-error.js';
import { ZodError } from 'zod';
import ProductsCategoriesSequelize from '../models/sql/products-categories.sql.js';
import ProductsCategoriesMongo from '../models/mongo/products-categories.mongo.js';
import { productCategoryCreateSchema } from '../schemas/products-categories.schema.js';
import { ValidationError } from 'sequelize';
import { sequelize } from '../sequelize.js';
import validator from 'validator';
import { Op } from 'sequelize';

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
export async function createProductCategory(req, res) {
  try {
    const result = await sequelize.transaction(async (t) => {
      const productCategoryCreateBody =
        await productCategoryCreateSchema.parseAsync(req.body);
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
    if (error instanceof ValidationError) {
      return res.status(400).json({ errors: error.errors });
    }
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: formatZodError(error) });
    }
    res.status(500).json({ message: error.message });
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
export async function getProductCategories(req, res) {
  try {
    const productsCategories = await ProductsCategoriesMongo.find({}).lean({});
    return res.json(productsCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
export async function getProductCategory(req, res) {
  try {
    const isUUID = validator.isUUID(req.params.category);

    const $orFilter = [];

    if (isUUID) {
      $orFilter.push({ _id: req.params.category });
    } else {
      $orFilter.push({ slug: req.params.category });
    }

    const productCategory = await ProductsCategoriesMongo.findOne({
      $or: $orFilter,
    }).lean();

    return res.json(productCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
export async function updateProductCategory(req, res) {
  try {
    const productCategory = await ProductsCategoriesSequelize.findByPk(
      req.params.category,
    );
    if (!productCategory) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }

    await productCategory.save();
    return res.json(productCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
export async function deleteProductCategory(req, res) {
  const isUUID = validator.isUUID(req.params.category);
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
    return res.status(404).json({ message: 'Catégorie introuvable' });
  }

  return res.status(204).json({ message: 'Catégorie supprimée' });
}
