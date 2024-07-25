const request = require('supertest');
const crypto = require('node:crypto');
const app = require('../../app');
const sequelize = require('../../models/sql');
const { ProductMongo } = require('../../models/mongo/products.mongo');
const CategoriesMongo = require('../../models/mongo/categories.mongo');
const generateAccessToken = require('../../utils/generate-access-token');
const createUser = require('../__helpers__/create-user');
const { faker } = require('@faker-js/faker');
const { Op } = require('sequelize');

const Products = sequelize.model('products');
const Categories = sequelize.model('categories');
const Users = sequelize.model('users');

describe('products.controller', () => {
  const adminUserData = createUser({
    password: 'password123',
    role: 'admin',
    isVerified: true,
  });
  const regularUserData = createUser({
    password: 'password123',
    role: 'user',
    isVerified: true,
  });
  const accountantUserData = createUser({
    password: 'password123',
    role: 'accountant',
    isVerified: true,
  });

  const usersIds = [
    adminUserData.id,
    regularUserData.id,
    accountantUserData.id,
  ];
  const productsIds = [];

  let adminToken, userToken, accountantToken;
  let testProduct, testCategory;

  beforeAll(async () => {
    const categoryData = {
      id: crypto.randomUUID(),
      name: faker.commerce.department(),
      description: faker.lorem.sentence(),
    };

    const [adminUser, regularUser, accountantUser] = await Users.bulkCreate(
      [adminUserData, regularUserData, accountantUserData],
      { individualHooks: true, validate: true },
    );

    const adminAccessTokenResult = await generateAccessToken(adminUser);
    const regularUserAccessTokenResult = await generateAccessToken(regularUser);
    const accountantAccessTokenResult =
      await generateAccessToken(accountantUser);

    adminToken = adminAccessTokenResult.accessToken;
    userToken = regularUserAccessTokenResult.accessToken;
    accountantToken = accountantAccessTokenResult.accessToken;

    testCategory = await Categories.create(categoryData);
    await CategoriesMongo.create(testCategory.toMongo());

    testProduct = await testCategory.createProduct({
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
    });
  });

  afterAll(async () => {
    await Products.destroy({
      where: {
        id: { [Op.in]: productsIds },
      },
    });
    await CategoriesMongo.deleteMany({});
    await Users.destroy({
      where: {
        id: { [Op.in]: usersIds },
      },
    });
    await ProductMongo.deleteMany({});
    await sequelize.close();
  });

  describe('GET /products', () => {
    it('should return a list of products', async () => {
      const res = await request(app).get('/products');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBeTruthy();
    });
  });

  describe('POST /products', () => {
    it('should create a new product when admin', async () => {
      const newProduct = {
        name: 'New Product',
        price: 149.99,
        description: 'This is a new product',
        categoryId: testCategory.id,
      };

      const res = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newProduct);

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe(newProduct.name);
    });

    it('should not allow non-admin to create a product', async () => {
      const newProduct = {
        name: 'Unauthorized Product',
        price: 99.99,
        description: 'This should not be created',
        categoryId: testCategory._id,
      };

      const res = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newProduct);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /products/:product', () => {
    it('should return a single product', async () => {
      const res = await request(app).get(`/products/${testProduct.id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe(testProduct.name);
    });
  });

  describe('PATCH /products/:product', () => {
    it('should update a product when admin', async () => {
      const update = { price: 129.99 };

      const res = await request(app)
        .patch(`/products/${testProduct.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(update);

      expect(res.statusCode).toBe(200);
      expect(res.body.price).toBe('129.99');
    });

    it('should not allow non-admin to update a product', async () => {
      const update = { price: 79.99 };

      const res = await request(app)
        .patch(`/products/${testProduct.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(update);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('DELETE /products/:product', () => {
    it('should delete a product when admin', async () => {
      const res = await request(app)
        .delete(`/products/${testProduct.id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(204);
    });

    it('should not allow non-admin to delete a product', async () => {
      const res = await request(app)
        .delete(`/products/${testProduct.id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /products/count', () => {
    it('should return product count for accountant', async () => {
      const res = await request(app)
        .get('/products/count')
        .set('Authorization', `Bearer ${accountantToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('count');
    });

    it('should not allow non-accountant to get product count', async () => {
      const res = await request(app)
        .get('/products/count')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /products/distribution-by-category', () => {
    it('should return category distribution for admin', async () => {
      const res = await request(app)
        .get('/products/distribution-by-category')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should not allow non-admin to get category distribution', async () => {
      const res = await request(app)
        .get('/products/distribution-by-category')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /products/price-distribution', () => {
    it('should return price distribution for admin', async () => {
      const res = await request(app)
        .get('/products/price-distribution')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should not allow non-admin to get price distribution', async () => {
      const res = await request(app)
        .get('/products/price-distribution')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });
});
