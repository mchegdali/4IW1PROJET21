const crypto = require('node:crypto');
const app = require('../../app');
const request = require('supertest');
const connection = require('../../models/mongo/db');
const sequelize = require('../../models/sql');

const Users = sequelize.model('users');
const { fakerFR: faker } = require('@faker-js/faker');
const UserMongo = require('../../models/mongo/user.mongo');

const firstname = faker.person.firstName();
const lastname = faker.person.lastName();
const fullname = faker.person.fullName({
  firstName: firstname,
  lastName: lastname,
});

const data = {
  fullname: fullname,
  email: faker.internet.email({
    firstName: firstname,
    lastName: lastname,
  }),
  password: 'Password1234.',
  id: crypto.randomUUID(),
  role: faker.helpers.arrayElement(['user', 'admin', 'accountant']),
  isVerified: true,
};

describe('auth.controller', () => {
  describe('POST /auth/login', function () {
    beforeAll(async () => {
      const userSql = await Users.create(data);
      const userMongo = userSql.toMongo();
      await UserMongo.create(userMongo);
    });

    test('should return 200 and a token', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: data.email,
          password: data.password,
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(typeof response.body.accessToken === 'string').toBe(true);
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('user');
    });
  });
});

afterAll(async () => {
  // await Users.destroy({
  //   where: {
  //     id: data.id,
  //   },
  // });

  await connection.close();
});
