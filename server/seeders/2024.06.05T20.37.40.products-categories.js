import slugify from '@sindresorhus/slugify';
import crypto from 'node:crypto';
import ProductsCategoriesMongo from '../models/mongo/products-categories.mongo.js';
import ProductsCategoriesSequelize from '../models/sql/products-categories.sql.js';

const now = new Date();
const productsCategories = [
  {
    id: crypto.randomUUID(),
    name: 'Thé vert',
    slug: slugify('Thé vert'),
    description:
      "Le thé vert est fabriqué à partir de feuilles et de bourgeons de Camellia sinensis qui n'ont pas subi le même processus de flétrissement et d'oxydation utilisé pour fabriquer le thé oolong et le thé noir. Cela donne un goût léger, délicat avec une douceur subtile.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: crypto.randomUUID(),
    name: 'Thé noir',
    slug: slugify('Thé noir'),
    description:
      'Le thé noir est entièrement oxydé, ce qui lui donne un goût fort et plein corps. Il peut varier du doux et fleuri au riche et terreux, en fonction de la variété et des méthodes de traitement utilisées.',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: crypto.randomUUID(),
    name: 'Thé Oolong',
    slug: slugify('Thé Oolong'),
    description:
      'Le thé Oolong est partiellement oxydé, ce qui donne un goût plus complexe que le thé vert mais moins fort que le thé noir. Il a souvent un parfum sucré, fleuri et une saveur douce et mielleuse.',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: crypto.randomUUID(),
    name: 'Thé blanc',
    slug: slugify('Thé blanc'),
    description:
      "Le thé blanc est fabriqué à partir des feuilles et des bourgeons les plus jeunes de la plante Camellia sinensis. Il n'est ni oxydé ni fermenté, ce qui préserve son goût délicat et sa douceur naturelle.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: crypto.randomUUID(),
    name: 'Thé Pu-erh',
    slug: slugify('Thé Pu-erh'),
    description:
      'Le thé Pu-erh est un type de thé noir qui est fermenté et vieilli. Ce processus lui donne un goût unique, terreux et légèrement fermenté. Il est souvent décrit comme ayant un goût de "champignon" ou de "boisé".',
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
    description: p.getDataValue('description'),
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
