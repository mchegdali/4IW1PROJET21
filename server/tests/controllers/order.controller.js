const request = require('supertest');
const crypto = require('node:crypto');
const app = require('../../app');
const sequelize = require('../../models/sql');
const { OrderMongo } = require('../../models/mongo/orders.mongo');
const StatusMongo = require('../../models/mongo/status.mongo');
const UsersMongo = require('../../models/mongo/user.mongo');
const generateAccessToken = require('../../utils/generate-access-token');
const createUser = require('../__helpers__/create-user');
const { faker } = require('@faker-js/faker');
const { Op } = require('sequelize');
const connection = require('../../models/mongo/db');

const Orders = sequelize.model('orders');
const Users = sequelize.model('users');

describe('orders.controller', () => {
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
  const ordersIds = [];

  let adminToken, userToken, accountantToken;
  let testOrder, testStatus;

  beforeAll(async () => {
    const statusData = {
      label: 'Pending',
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

    testStatus = await StatusMongo.create(statusData);

    testOrder = await Orders.create({
      userId: regularUser.id,
      statusId: testStatus._id,
      items: JSON.stringify([
        {
          _id: crypto.randomUUID(),
          name: faker.commerce.productName(),
          price: faker.commerce.price(),
        },
      ]),
      totalPrice: faker.commerce.price(),
    });

    await OrderMongo.create({
      _id: testOrder.id,
      orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: testStatus,
      items: JSON.parse(testOrder.items),
      totalPrice: testOrder.totalPrice,
      user: {
        _id: regularUser.id,
        fullname: regularUser.fullname,
        email: regularUser.email,
      },
      address: {
        _id: crypto.randomUUID(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        region: faker.address.state(),
        country: faker.address.country(),
        street: faker.address.streetAddress(),
        zipCode: faker.address.zipCode(),
        city: faker.address.city(),
        phone: faker.phone.number(),
      },
    });
  });

  afterAll(async () => {
    await Orders.destroy({
      where: {
        id: { [Op.in]: ordersIds },
      },
    });
    await Users.destroy({
      where: {
        id: { [Op.in]: usersIds },
      },
    });
    await OrderMongo.deleteMany({});
    await StatusMongo.deleteMany({});
    await sequelize.close();
    await connection.close();
  });

  describe('GET /orders', () => {
    it('should return a list of orders for admin', async () => {
      const res = await request(app)
        .get('/orders')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('items');
      expect(res.body).toHaveProperty('metadata');
    });

    it('should return a list of orders for accountant', async () => {
      const res = await request(app)
        .get('/orders')
        .set('Authorization', `Bearer ${accountantToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('items');
      expect(res.body).toHaveProperty('metadata');
    });

    it('should not allow regular users to get all orders', async () => {
      const res = await request(app)
        .get('/orders')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(403);
    });
  });

  describe('POST /orders', () => {
    it('should create a new order', async () => {
      const newOrder = {
        user: regularUserData.id,
        address: crypto.randomUUID(),
      };

      const res = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newOrder);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id');
    });
  });

  describe('GET /orders/:id', () => {
    it('should return a single order for the owner', async () => {
      const res = await request(app)
        .get(`/orders/${testOrder.id}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(testOrder.id);
    });
  });

  describe('PATCH /orders/:id', () => {
    it('should update an order for the owner', async () => {
      const update = { totalPrice: '150.00' };

      const res = await request(app)
        .patch(`/orders/${testOrder.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(update);

      expect(res.statusCode).toBe(204);
    });
  });

  describe('DELETE /orders/:id', () => {
    it('should delete an order for the owner', async () => {
      const res = await request(app)
        .delete(`/orders/${testOrder.id}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(204);
    });
  });

  describe('GET /orders/count', () => {
    it('should return order count for admin', async () => {
      const res = await request(app)
        .get('/orders/count')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('count');
    });

    it('should not allow non-admin to get order count', async () => {
      const res = await request(app)
        .get('/orders/count')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /orders/monthly-count', () => {
    it('should return monthly order count for accountant', async () => {
      const res = await request(app)
        .get('/orders/monthly-count')
        .set('Authorization', `Bearer ${accountantToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('months');
      expect(res.body).toHaveProperty('counts');
    });

    it('should not allow non-accountant to get monthly order count', async () => {
      const res = await request(app)
        .get('/orders/monthly-count')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /orders/revenue', () => {
    it('should return total revenue for admin', async () => {
      const res = await request(app)
        .get('/orders/revenue')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('totalRevenue');
    });

    it('should not allow non-admin to get total revenue', async () => {
      const res = await request(app)
        .get('/orders/revenue')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /orders/total-sales', () => {
    it('should return total sales for accountant', async () => {
      const res = await request(app)
        .get('/orders/total-sales')
        .set('Authorization', `Bearer ${accountantToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('totalSales');
    });

    it('should not allow non-accountant to get total sales', async () => {
      const res = await request(app)
        .get('/orders/total-sales')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /orders/distinct-customers', () => {
    it('should return distinct customer count for accountant', async () => {
      const res = await request(app)
        .get('/orders/distinct-customers')
        .set('Authorization', `Bearer ${accountantToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('distinctCustomerCount');
    });

    it('should not allow non-accountant to get distinct customer count', async () => {
      const res = await request(app)
        .get('/orders/distinct-customers')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /orders/status-distribution', () => {
    it('should return status distribution for admin', async () => {
      const res = await request(app)
        .get('/orders/status-distribution')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should not allow non-admin to get status distribution', async () => {
      const res = await request(app)
        .get('/orders/status-distribution')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /users/:userId/orders', () => {
    it('should return orders for a specific user', async () => {
      const res = await request(app)
        .get(`/users/${regularUserData.id}/orders`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });
});
