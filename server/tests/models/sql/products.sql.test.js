const { Sequelize } = require('sequelize');
const { faker } = require('@faker-js/faker');
const sequelize = require('../../../models/sql');
const { ProductMongo } = require('../../../models/mongo/products.mongo');
const UserMongo = require('../../../models/mongo/user.mongo');
const CategoriesMongo = require('../../../models/mongo/categories.mongo');

const Products = sequelize.model('products');
const Categories = sequelize.model('categories');

// Mock external dependencies
jest.mock('../../../models/mongo/products.mongo');
jest.mock('../../../models/mongo/user.mongo');
jest.mock(
  '../../../utils/slugify',
  () => (str) => str.toLowerCase().replace(/ /g, '-'),
);

describe('Products Model', () => {
  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a product with a slug', async () => {
    const product = await Products.create({
      name: 'Test Product',
      price: 10.99,
      description: 'A test product',
      image: 'test.jpg',
    });

    expect(product.slug).toBeDefined();
    expect(product.slug).toMatch(/test-product-[\w-]+/);
  });

  it('should associate a product with a category', async () => {
    const categoryData = {
      name: faker.commerce.department(),
      description: 'A test category',
    };

    const category = await Categories.create(categoryData);

    await CategoriesMongo.create(category.toMongo());

    const product = await Products.create({
      name: faker.commerce.productName(),
      price: 10.99,
      description: 'A test product',
      image: 'test.jpg',
      categoryId: category.id,
    });

    const productWithCategory = await Products.findByPk(product.id, {
      include: [Categories],
    });

    expect(productWithCategory.category).toBeDefined();
    expect(productWithCategory.category.name).toBe(categoryData.name);
  });

  it('should create a MongoDB document after creating a product', async () => {
    const categoryData = {
      name: faker.commerce.department(),
      description: 'A test category',
    };

    const category = await Categories.create(categoryData);
    const product = await Products.create({
      name: faker.commerce.productName(),
      price: 10.99,
      description: 'A test product',
      image: 'test.jpg',
      categoryId: category.id,
    });

    const productMongo = await product.toMongo();

    expect(ProductMongo.create).toHaveBeenCalledWith(
      expect.objectContaining(productMongo),
    );
  });

  it('should update MongoDB document after updating a product', async () => {
    const product = await Products.create({
      name: 'Test Product',
      price: 10.99,
      description: 'A test product',
      image: 'test.jpg',
    });

    await product.update({ price: 15.99 });

    expect(ProductMongo.updateOne).toHaveBeenCalledWith(
      { _id: product.id },
      expect.objectContaining({
        $set: expect.objectContaining({
          price: 15.99,
        }),
      }),
      expect.anything(),
    );

    expect(UserMongo.updateMany).toHaveBeenCalled();
  });

  it('should delete MongoDB document after destroying a product', async () => {
    const product = await Products.create({
      name: 'Test Product',
      price: 10.99,
      description: 'A test product',
      image: 'test.jpg',
    });

    await product.destroy();

    expect(ProductMongo.deleteOne).toHaveBeenCalledWith({ _id: product.id });
    expect(UserMongo.updateMany).toHaveBeenCalled();
  });

  it('should convert to MongoDB format', async () => {
    let category;
    try {
      category = await Categories.create({
        name: faker.lorem.words(),
        description: 'A test category',
      });
    } catch (e) {
      console.log('category', e);
    }

    console.log('category', category);

    const product = await Products.create({
      name: 'Test Product',
      price: 10.99,
      description: 'A test product',
      image: 'test.jpg',
      categoryId: category.id,
    });

    const mongoProduct = await product.toMongo();

    expect(mongoProduct).toMatchObject({
      _id: product.id,
      slug: product.slug,
      name: product.name,
      description: 'A test product',
      category: {
        _id: category.id,
        name: category.name,
        slug: category.slug,
      },
      image: 'test.jpg',
      price: (10.99).toString(10),
    });
  });
});
