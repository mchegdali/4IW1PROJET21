import ProductMongo from '../models/mongo/products.mongo.js';
import ProductsSequelize from '../models/sql/products.sql.js';
import slugify from '@sindresorhus/slugify';
import { fakerFR as faker } from '@faker-js/faker';
import crypto from 'node:crypto';
import ProductsCategoriesMongo from '../models/mongo/products-categories.mongo.js';

const imageFormats = ['png', 'jpg', 'jpeg', 'avif', 'webp'];

function getRandomImageFormat() {
  return faker.helpers.arrayElement(imageFormats);
}

/**
 *
 * @param {string} categoryId
 * @returns
 */
function createProduct(categoryId) {
  const id = crypto.randomUUID();
  const productIdLastPart = id.split('-').at(-1);
  const name = faker.commerce.productName();
  const description = faker.commerce.productDescription();
  const slug = slugify(`${name}-${productIdLastPart}`);
  const image = faker.image.urlPlaceholder({
    width: 200,
    height: 200,
    format: getRandomImageFormat(),
    text: name,
  });
  const price = faker.commerce.price({ min: 10, max: 1000 });
  const now = new Date();

  return {
    id,
    name,
    slug,
    description,
    image,
    price,
    categoryId,
    createdAt: now,
    updatedAt: now,
  };
}

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
  const productsCategories = await ProductsCategoriesMongo.find(
    {},
    {
      name: 1,
      slug: 1,
    },
  ).lean();

  const products = [];
  const categoriesMap = new Map();

  for (const category of productsCategories) {
    const _id = category._id.toString('utf-8');
    categoriesMap.set(_id, category);

    for (let i = 0; i < faker.number.int({ min: 1, max: 10 }); i++) {
      const product = createProduct(_id);
      products.push(product);
    }
  }

  const createdProducts = await ProductsSequelize.bulkCreate(products, {
    validate: true,
  });

  const createdProductsMongo = createdProducts.map((p) => ({
    _id: p.getDataValue('id'),
    slug: p.getDataValue('slug'),
    name: p.getDataValue('name'),
    description: p.getDataValue('description'),
    category: categoriesMap.get(p.getDataValue('categoryId')),
    image: p.getDataValue('image'),
    price: p.getDataValue('price'),
  }));

  await ProductMongo.insertMany(createdProductsMongo);
};

/**
 *
 * @param {MigrationParams} params
 *
 */
export const down = async ({ context: { sequelize, mongoose } }) => {
  const queryInterface = sequelize.getQueryInterface();
  await queryInterface.bulkDelete('products', null, {});
  await ProductMongo.deleteMany({});
};
