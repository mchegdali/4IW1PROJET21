const crypto = require('node:crypto');
const app = require('../../app');
const request = require('supertest');
const connection = require('../../models/mongo/db');
const sequelize = require('../../models/sql');
const jose = require('jose');
const authConfig = require('../../config/auth.config');

const Users = sequelize.model('users');
const { Op } = require('sequelize');
const createUser = require('../__helpers__/create-user');

const verifiedUser = createUser({
  password: 'Password1234.',
  isVerified: true,
});
const unverifiedUser = createUser({
  password: 'Password1234.',
  isVerified: false,
});

describe('auth.controller', () => {
  let accessToken;
  let refreshToken;

  beforeAll(async () => {
    await Users.bulkCreate([verifiedUser, unverifiedUser], {
      individualHooks: true,
      validate: true,
    });
  });

  describe('POST /auth/login', function () {
    test('should return 200 and tokens with user data', async () => {
      const response = await request(app).post('/auth/login').send({
        email: verifiedUser.email,
        password: verifiedUser.password,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(typeof response.body.accessToken).toBe('string');
      expect(response.body).toHaveProperty('refreshToken');
      expect(typeof response.body.refreshToken).toBe('string');

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          fullname: expect.any(String),
          email: expect.any(String),
          role: expect.stringMatching(/^(user|admin|accountant)$/),
          newProductAlert: expect.any(Boolean),
          restockAlert: expect.any(Boolean),
          priceChangeAlert: expect.any(Boolean),
          newsletterAlert: expect.any(Boolean),
        }),
      );

      expect(response.body.user.email).toBe(verifiedUser.email);
      expect(response.body.user.fullname).toBe(verifiedUser.fullname);
      expect(response.body.user.role).toBe(verifiedUser.role);

      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;
    });

    test('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: verifiedUser.email,
          password: 'wrongpassword',
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /auth/refresh-token', function () {
    test('should return 200 and a new access token', async () => {
      const response = await request(app)
        .post('/auth/refresh-token')
        .send({ refreshToken })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);

      expect(typeof response.text === 'string').toBe(true);
    });

    test('should return 401 for invalid refresh token', async () => {
      const response = await request(app)
        .post('/auth/refresh-token')
        .send({ refreshToken: 'invalid_token' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /auth/forgot-password', function () {
    test('should return 204 for existing email', async () => {
      const response = await request(app)
        .post('/auth/forgot-password')
        .send({ email: verifiedUser.email })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(204);
    });

    test('should return 204 for non-existing email', async () => {
      const response = await request(app)
        .post('/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(204);
    });
  });

  describe('POST /auth/reset-password', function () {
    let resetToken;

    beforeAll(async () => {
      const now = Math.floor(Date.now() / 1000);
      const resetTokenSign = new jose.SignJWT()
        .setSubject(verifiedUser.id)
        .setIssuedAt(now)
        .setExpirationTime('15m')
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setNotBefore(now);

      resetToken = await resetTokenSign.sign(
        authConfig.forgotPasswordTokenSecret,
      );
    });

    test('should return 204 for valid reset token', async () => {
      const response = await request(app)
        .post('/auth/reset-password')
        .set('Authorization', `Bearer ${resetToken}`)
        .send({
          password: 'NewPassword1234.',
          confirmPassword: 'NewPassword1234.',
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(204);
    });

    test('should return 401 for invalid reset token', async () => {
      const response = await request(app)
        .post('/auth/reset-password')
        .set('Authorization', 'Bearer invalid_token')
        .send({
          password: 'NewPassword1234.',
          confirmPassword: 'NewPassword1234.',
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /auth/resend-confirmation-email', function () {
    test('should return 204 for existing email', async () => {
      const response = await request(app)
        .post('/auth/resend-confirmation-email')
        .send({ email: verifiedUser.email })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(204);
    });

    test('should return 204 for non-existing email', async () => {
      const response = await request(app)
        .post('/auth/resend-confirmation-email')
        .send({ email: 'nonexistent@example.com' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(204);
    });
  });
});

afterAll(async () => {
  await Users.destroy({
    where: {
      id: {
        [Op.in]: [verifiedUser.id, unverifiedUser.id],
      },
    },
    individualHooks: true,
  });

  await connection.close();
  await sequelize.close();
});
