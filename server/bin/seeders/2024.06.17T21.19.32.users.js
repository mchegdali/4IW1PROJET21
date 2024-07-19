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

  await sequelize.transaction(async (t) => {
    const usersToCreate = [];

    // Boucle pour créer 40 utilisateurs par mois avec des createdAt randoms
    for (let i = 0; i < 40; i++) {

      const month = Math.floor(Math.random() * 12);
      const day = Math.floor(Math.random() * 28) + 1;
      const createdAt = dayjs(new Date(2024, month, day)).toDate();
      const updatedAt = createdAt;
    
      usersToCreate.push({
        id: crypto.randomUUID(),
        fullname: `User USER ${i}`,
        email: `user${i}@user.fr`,
        password: 'Password1234.',
        role: 'user',
        isVerified: true,
        addresses: [
          {
            id: crypto.randomUUID(),
            firstName: faker.lorem.word(),
            lastName: faker.lorem.word(),
            street: faker.location.streetAddress(true),
            city: faker.location.city(),
            region: faker.lorem.word(),
            zipCode: faker.location.zipCode(),
            country: faker.location.country(),
            phone: faker.phone.number(),
            createdAt,
            updatedAt,
            deletedAt: null,
          },
        ],
        createdAt,
        updatedAt,
        deletedAt: null,
      });
    }

    const createdUsers = [];
    for (const userData of usersToCreate) {
      const user = await Users.create(userData, {
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
            ],
          },
        ],
        transaction: t,
      });
      createdUsers.push(user);
    }

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
            deletedAt: null,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
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
            ],
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
            deletedAt: null,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
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
            ],
          },
        ],
        transaction: t,
      },
    );

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
            deletedAt: null,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
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
            ],
          },
        ],
        transaction: t,
      },
    );

    const createdUsersMongo = [...createdUsers, admin, accountant, user].map((u) => ({
      _id: u.id,
      fullname: u.fullname,
      email: u.email,
      password: u.password,
      passwordValidUntil: u.passwordValidUntil,
      role: u.role,
      isVerified: u.isVerified,
      addresses: u.getDataValue('addresses').map((a) => a.toMongo()),
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      deletedAt: u.deletedAt,
    }));

    console.log(createdUsersMongo);

    await UserMongo.insertMany(createdUsersMongo);
    console.log("salut");
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
