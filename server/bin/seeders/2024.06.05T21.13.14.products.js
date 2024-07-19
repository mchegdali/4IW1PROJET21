const slugify = require('../../utils/slugify');
const { fakerFR: faker } = require('@faker-js/faker');
const crypto = require('node:crypto');

const minProducts = 10;
const maxProducts = 20;
const imageFormats = ['png', 'jpg', 'jpeg', 'webp'];

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
    format: faker.helpers.arrayElement(imageFormats),
    format: faker.helpers.arrayElement(imageFormats),
    text: name,
  });
  const price = faker.commerce.price({ min: 10, max: 1000 });
  const createdAt = faker.date.past();

  return {
    id,
    name,
    slug,
    description,
    image,
    price,
    categoryId,
    createdAt: createdAt,
    updatedAt: createdAt,
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

  await Products.bulkCreate(products, {
  await Products.bulkCreate(products, {
    validate: true,
    returning: true,
    individualHooks: true,
  });
    individualHooks: true,
  });
};

/**
 *
 * @param {MigrationParams} params
 *
 */
const down = async ({ context: { sequelize } }) => {
  const Products = sequelize.model('products');
  await Products.destroy({
    truncate: true,
    cascade: true,
    force: true,
    individualHooks: true,
  });
  await Products.destroy({
    truncate: true,
    cascade: true,
    force: true,
    individualHooks: true,
  });
};

module.exports = { up, down };
