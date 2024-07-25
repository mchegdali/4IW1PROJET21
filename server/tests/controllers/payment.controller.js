const request = require('supertest');
const crypto = require('node:crypto');
const app = require('../../app');
const sequelize = require('../../models/sql');
const generateAccessToken = require('../../utils/generate-access-token');
const createUser = require('../__helpers__/create-user');
const { faker } = require('@faker-js/faker');
const { Op } = require('sequelize');

const Payments = sequelize.model('payments');
const Users = sequelize.model('users');

describe('payments.controller', () => {
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

  const usersIds = [adminUserData.id, regularUserData.id];
  const paymentsIds = [];

  let adminToken, userToken;
  let testPayment;

  beforeAll(async () => {
    const [adminUser, regularUser] = await Users.bulkCreate(
      [adminUserData, regularUserData],
      { individualHooks: true, validate: true },
    );

    const adminAccessTokenResult = await generateAccessToken(adminUser);
    const regularUserAccessTokenResult = await generateAccessToken(regularUser);

    adminToken = adminAccessTokenResult.accessToken;
    userToken = regularUserAccessTokenResult.accessToken;

    testPayment = await Payments.create({
      userId: regularUser.id,
      amount: faker.finance.amount(),
      status: 'pending',
      paymentMethod: 'credit_card',
    });
  });

  afterAll(async () => {
    await Payments.destroy({
      where: {
        id: { [Op.in]: paymentsIds },
      },
    });
    await Users.destroy({
      where: {
        id: { [Op.in]: usersIds },
      },
    });
    await sequelize.close();
  });

  describe('POST /payments', () => {
    it('should create a new payment', async () => {
      const newPayment = {
        amount: 100.0,
        paymentMethod: 'credit_card',
      };

      const res = await request(app)
        .post('/payments')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newPayment);

      expect(res.statusCode).toBe(201);
      expect(res.body.amount).toBe('100.00');
      expect(res.body.status).toBe('pending');
    });
  });
});
