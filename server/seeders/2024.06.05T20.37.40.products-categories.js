import slugify from '@sindresorhus/slugify';
import { QueryTypes } from 'sequelize';
import crypto from 'node:crypto';
import ProductsCategoriesMongo from '../models/mongo/products-categories.mongo.js';
import ProductsCategoriesSequelize from '../models/sql/products-categories.sql.js';

const now = new Date();
const productsCategories = [
  {
    id: crypto.randomUUID(),
    name: 'Thé vert',
    slug: slugify('Thé vert'),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: crypto.randomUUID(),
    name: 'Thé noir',
    slug: slugify('Thé noir'),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: crypto.randomUUID(),
    name: 'Thé Oolong',
    slug: slugify('Thé Oolong'),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: crypto.randomUUID(),
    name: 'Thé blanc',
    slug: slugify('Thé blanc'),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: crypto.randomUUID(),
    name: 'Thé Pu-erh',
    slug: slugify('Thé Pu-erh'),
    createdAt: now,
    updatedAt: now,
  },
];

/**
 * @typedef { Object } MigrationParams
 * @property { string } name
 * @property { string } [path]
 * @property { Object } context
 * @property { import('sequelize').Sequelize } context.sequelize
 * @property { import('mongoose').Mongoose } context.mongoose
 */

/**
 *
 * @param {MigrationParams} params
 *
 */
export const up = async () => {
  const productsCategoriesSequelize =
    await ProductsCategoriesSequelize.bulkCreate(productsCategories, {
      validate: true,
    });

  const productsCategoriesMongo = productsCategoriesSequelize.map((p) => ({
    _id: p.getDataValue('id'),
    slug: p.getDataValue('slug'),
    name: p.getDataValue('name'),
    createdAt: p.getDataValue('createdAt'),
    updatedAt: p.getDataValue('updatedAt'),
  }));

  await ProductsCategoriesMongo.create(productsCategoriesMongo);
};

/**
 *
 * @param {MigrationParams} params
 *
 */
export const down = async ({ context: { sequelize, mongoose } }) => {
  const queryInterface = sequelize.getQueryInterface();
  await queryInterface.bulkDelete('products_categories', null, {});
  await ProductsCategoriesMongo.deleteMany({});
};
