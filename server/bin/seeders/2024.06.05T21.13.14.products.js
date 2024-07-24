const slugify = require('../../utils/slugify');
const { fakerFR: faker } = require('@faker-js/faker');
const crypto = require('node:crypto');

const imageUrls = [
  'https://ideogram.ai/assets/image/list/response/StxsigUlSHanNdMmSXTtLg',
  'https://ideogram.ai/assets/image/list/response/0iVcWGNeTPihYaVu1f0Sxg',
  'https://ideogram.ai/assets/image/list/response/CMLFMJgzRem6OJamWoQwcA',
  'https://ideogram.ai/assets/image/list/response/DeuSYVS5QRiJQ4JXXQJ-bA',
  'https://ideogram.ai/assets/image/list/response/FCmoueCkS4q5zbI4xWnW4g',
  'https://ideogram.ai/assets/progressive-image/balanced/response/KDv3X5zjShaAFlLuxsQ4gA',
  'https://ideogram.ai/assets/progressive-image/balanced/response/8Z7Qs8z-R46YEf9ex0g4Xw',
  'https://ideogram.ai/assets/progressive-image/balanced/response/UretTPooRK6TTrRL5MZwNg',
  'https://ideogram.ai/assets/progressive-image/balanced/response/0eqzwWtfQwqIsbV1h8FOCg',
];

const teaAdjectives = [
  'Délicieux',
  'Aromatique',
  'Biologique',
  'Relaxant',
  'Énergisant',
  'Parfumé',
  'Exotique',
  'Traditionnel',
  'Raffiné',
  'Subtil',
];

const teaTypes = [
  'Thé Vert',
  'Thé Noir',
  'Thé Blanc',
  'Thé Oolong',
  'Rooibos',
  'Thé Earl Grey',
  'Thé Chai',
  'Thé au Jasmin',
  'Thé Matcha',
  'Thé Pu-erh',
];

function createTeaProduct(categoryId) {
  const id = crypto.randomUUID();
  const productIdLastPart = id.split('-').at(-1);
  const adjective = faker.helpers.arrayElement(teaAdjectives);
  const teaType = faker.helpers.arrayElement(teaTypes);
  const name = `${adjective} ${teaType}`;
  const description = `Un ${name.toLowerCase()} exceptionnel avec des notes ${faker.word.adjective()} et une finition ${faker.word.adjective()}.`;
  const slug = slugify(`${name}-${productIdLastPart}`);
  const image = faker.helpers.arrayElement(imageUrls);
  const price = faker.commerce.price({ min: 5, max: 20 });
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

const up = async ({ context: { sequelize } }) => {
  const Categories = sequelize.model('categories');
  const Products = sequelize.model('products');
  const categories = await Categories.findAll();
  const products = [];

  for (const category of categories) {
    for (let i = 0; i < 10; i++) {
      const product = createTeaProduct(category.id);
      products.push(product);
    }
  }

  await Products.bulkCreate(products, {
    validate: true,
    returning: true,
    individualHooks: true,
  });
};

const down = async ({ context: { sequelize } }) => {
  const Products = sequelize.model('products');
  await Products.destroy({
    truncate: true,
    cascade: true,
    force: true,
    individualHooks: true,
  });
};

module.exports = { up, down };
