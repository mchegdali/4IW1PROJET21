import slugify from '@sindresorhus/slugify';
import { DataTypes } from 'sequelize';
import crypto from 'node:crypto';

const productsCategories = [
  {
    id: crypto.randomUUID(),
    name: 'Thé vert',
    slug: slugify('Thé vert'),
  },
  {
    id: crypto.randomUUID(),
    name: 'Thé noir',
    slug: slugify('Thé noir'),
  },
  {
    id: crypto.randomUUID(),
    name: 'Thé Oolong',
    slug: slugify('Thé Oolong'),
  },
  {
    id: crypto.randomUUID(),
    name: 'Thé blanc',
    slug: slugify('Thé blanc'),
  },
  {
    id: crypto.randomUUID(),
    name: 'Thé Pu-erh',
    slug: slugify('Thé Pu-erh'),
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
export const up = async ({ context: { sequelize } }) => {
  const queryInterface = sequelize.getQueryInterface();
  await queryInterface.bulkInsert('products_categories', productsCategories);
};

/**
 *
 * @param {MigrationParams} params
 *
 */
export const down = async ({ context: { sequelize, mongoose } }) => {
  const queryInterface = sequelize.getQueryInterface();
  await queryInterface.bulkDelete('products_categories', null, {});
};
