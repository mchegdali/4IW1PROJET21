const { fakerFR: faker } = require('@faker-js/faker');
const UserMongo = require('../../models/mongo/user.mongo');
const crypto = require('node:crypto');
const dayjs = require('dayjs');

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
  console.log("début");
  const Users = sequelize.model('users');
  const Addresses = sequelize.model('addresses');

  const users = [
    {
      id: crypto.randomUUID(),
      fullname: 'User USER',
      email: 'user@user.fr',
      password: 'Password1234.',
      role: 'user',
      isVerified: true,
      addresses: [
        {
          firstName: faker.lorem.word(),
          lastName: faker.lorem.word(),
          street: faker.location.streetAddress(true),
          city: faker.location.city(),
          region: faker.lorem.word(),
          zipCode: faker.location.zipCode(),
          country: faker.location.country(),
          phone: faker.phone.number(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      fullname: 'Admin ADMIN',
      email: 'admin@admin.fr',
      password: 'Password1234.',
      role: 'admin',
      isVerified: true,
      addresses: [
        {
          firstName: faker.lorem.word(),
          lastName: faker.lorem.word(),
          street: faker.location.streetAddress(true),
          city: faker.location.city(),
          region: faker.lorem.word(),
          zipCode: faker.location.zipCode(),
          country: faker.location.country(),
          phone: faker.phone.number(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      fullname: 'Accountant ACCOUNTANT',
      email: 'accountant@accountant.fr',
      password: 'Password1234.',
      role: 'accountant',
      isVerified: true,
      addresses: [
        {
          firstName: faker.lorem.word(),
          lastName: faker.lorem.word(),
          street: faker.location.streetAddress(true),
          city: faker.location.city(),
          region: faker.lorem.word(),
          zipCode: faker.location.zipCode(),
          country: faker.location.country(),
          phone: faker.phone.number(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await sequelize.transaction(async (t) => {
    for (const user of users) {
      await Users.create(user, {
        validate: true,
        returning: true,
        include: [
          {
            model: Addresses,
            as: 'addresses',
            attributes: [
              'id',
              'firstName',
              'lastName',
              'street',
              'city',
              'region',
              'zipCode',
              'country',
              'phone',
              'createdAt',
              'updatedAt',
              'deletedAt',
            ],
          },
        ],
        transaction: t,
      });
    }
  });
  console.log("hey");
};

/**
 *
 * @param {MigrationParams} params
 *
 */
const down = async ({ context: { sequelize } }) => {
  const Users = sequelize.model('users');
  const Addresses = sequelize.model('addresses');
  await Users.destroy({ truncate: true, cascade: true, force: true });
  await Addresses.destroy({ truncate: true, cascade: true, force: true });
  await UserMongo.deleteMany({});
};

module.exports = { up, down };
