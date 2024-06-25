const { fakerFR: faker } = require('@faker-js/faker');
const UserMongo = require('../../models/mongo/user.mongo');
const crypto = require('node:crypto');

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
  const Users = sequelize.model('users');
  const Addresses = sequelize.model('addresses');
  const users = [];

  users.push({
    fullname: 'Accountant ACCOUNTANT',
    email: 'accountant@accountant.fr',
    password: 'Password1234.',
    role: 'accountant',
    isVerified: true,
    addresses: [
      {
        street: faker.location.streetAddress(true),
        city: faker.location.city(),
        zipCode: faker.location.zipCode(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await sequelize.transaction(async (t) => {
    const user = await Users.create(
      {
        id: crypto.randomUUID(),
        fullname: 'User USER',
        email: 'user@user.fr',
        password: 'Password1234.',
        role: 'user',
        isVerified: true,
        addresses: [
          {
            id: crypto.randomUUID(),
            street: faker.location.streetAddress(true),
            city: faker.location.city(),
            zipCode: faker.location.zipCode(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        validate: true,
        returning: true,
        include: [
          {
            model: Addresses,
            as: 'addresses',
            attributes: ['id', 'street', 'city', 'zipCode'],
          },
        ],
        transaction: t,
      },
    );

    const admin = await Users.create(
      {
        id: crypto.randomUUID(),
        fullname: 'Admin ADMIN',
        email: 'admin@admin.fr',
        password: 'Password1234.',
        role: 'admin',
        isVerified: true,
        addresses: [
          {
            id: crypto.randomUUID(),
            street: faker.location.streetAddress(true),
            city: faker.location.city(),
            zipCode: faker.location.zipCode(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        validate: true,
        returning: true,
        include: [
          {
            model: Addresses,
            as: 'addresses',
            attributes: ['id', 'street', 'city', 'zipCode'],
          },
        ],
        transaction: t,
      },
    );

    const accountant = await Users.create(
      {
        fullname: 'Accountant ACCOUNTANT',
        email: 'accountant@accountant.fr',
        password: 'Password1234.',
        role: 'accountant',
        isVerified: true,
        addresses: [
          {
            street: faker.location.streetAddress(true),
            city: faker.location.city(),
            zipCode: faker.location.zipCode(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        validate: true,
        returning: true,
        include: [
          {
            model: Addresses,
            as: 'addresses',
            attributes: ['id', 'street', 'city', 'zipCode'],
          },
        ],
        transaction: t,
      },
    );

    const createdUsersMongo = [user, admin, accountant].map((u) => ({
      _id: u.id,
      fullname: u.fullname,
      email: u.email,
      password: u.password,
      passwordValidUntil: u.passwordValidUntil,
      role: u.role,
      isVerified: u.isVerified,
      addresses: u.getDataValue('addresses').map((a) => a.toMongo()),
    }));

    await UserMongo.insertMany(createdUsersMongo);
  });
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
