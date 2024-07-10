const crypto = require('node:crypto');
const app = require('../../app');
const request = require('supertest');
const connection = require('../../models/mongo/db');
const sequelize = require('../../models/sql');

const UserMongo = require('../../models/mongo/user.mongo');
const Users = sequelize.model('users');
const { fakerFR: faker } = require('@faker-js/faker');

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
  describe('POST /auth/login', () => {
    let user;

    beforeAll(async () => {
      const userSql = await Users.create(data);
      const userMongo = userSql.toMongo();

      const userDoc = await UserMongo.create(userMongo);

      user = userDoc;
    });

    test('should return 200 and a token', (done) => {
      request(app)
        .post('/auth/login')
        .send({
          email: data.email,
          password: data.password,
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(typeof res.body.accessToken === 'string').toBe(true);
          expect(res.body).toHaveProperty('refreshToken');
          expect(res.body).toHaveProperty('user');
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
});

afterAll(async () => {
  await Users.destroy({
    where: {
      email: data.email,
    },
  });
  await UserMongo.deleteOne({
    email: data.email,
  });

  await connection.close();
});
