import ProductMongo from '../models/mongo/products.mongo.js';
import slugify from '@sindresorhus/slugify';
import { fakerFR as faker } from '@faker-js/faker';
import crypto from 'node:crypto';
import ProductsCategoriesMongo from '../models/mongo/products-categories.mongo.js';

const minProducts = 2;
const maxProducts = 5;
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
export const up = async ({ context: { sequelize } }) => {
  const queryInterface = sequelize.getQueryInterface();
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

    for (
      let i = 0;
      i < faker.number.int({ min: minProducts, max: maxProducts });
      i++
    ) {
      const product = createProduct(_id);
      products.push(product);
    }
  }

  const createdProducts = await queryInterface.bulkInsert(
    'products',
    products,
    {
      validate: true,
      returning: true,
    },
  );

  console.log(createdProducts[0]);

  const createdProductsMongo = createdProducts.map((p) => ({
    _id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    category: categoriesMap.get(p.categoryId),
    image: p.image,
    price: p.price,
  }));

  await ProductMongo.insertMany(createdProductsMongo);
};

/**
 *
 * @param {MigrationParams} params
 *
 */
export const down = async ({ context: { sequelize } }) => {
  const queryInterface = sequelize.getQueryInterface();
  await queryInterface.bulkDelete('products', null, {});
  await ProductMongo.deleteMany({});
};
