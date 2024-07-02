const ProductMongo = require('../../models/mongo/products.mongo');
const slugify = require('../../utils/slugify');
const { fakerFR: faker } = require('@faker-js/faker');
const crypto = require('node:crypto');

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
 * @property { import("../../models/sql") } context.sequelize
 * @property { Object } context.mongoose
 */

/**
 *
 * @param {MigrationParams} params
 *
 */
const up = async ({ context: { sequelize } }) => {
  const Categories = sequelize.model('categories');
  const Products = sequelize.model('products');
  const categories = await Categories.findAll();

  const products = [];

  for (const category of categories) {
    for (
      let i = 0;
      i < faker.number.int({ min: minProducts, max: maxProducts });
      i++
    ) {
      const product = createProduct(category.id);
      products.push(product);
    }
  }

  // throw new Error('TODO');

  const createdProducts = await Products.bulkCreate(products, {
    validate: true,
    returning: true,
  });

  const createdProductsMongo = await Promise.all(
    createdProducts.map((p) => p.toMongo()),
  );

  await ProductMongo.insertMany(createdProductsMongo);
};

/**
 *
 * @param {MigrationParams} params
 *
 */
const down = async ({ context: { sequelize } }) => {
  const Products = sequelize.model('products');
  await Products.destroy({ truncate: true, cascade: true, force: true });
  await ProductMongo.deleteMany({});
};

module.exports = { up, down };
