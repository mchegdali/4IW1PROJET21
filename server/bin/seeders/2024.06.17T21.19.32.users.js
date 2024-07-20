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
  const Users = sequelize.model('users');
  const Addresses = sequelize.model('addresses');

  await sequelize.transaction(async (t) => {
    const usersToCreate = [];

    // Boucle pour créer 40 utilisateurs par mois avec des createdAt randoms
    for (let i = 0; i < 40; i++) {
      const createdAt = faker.date.between({
        from: dayjs().startOf('year').toDate(),
        to: dayjs().toDate(),
      });
      const updatedAt = createdAt;

      usersToCreate.push({
        // id: crypto.randomUUID(),
        fullname: `User USER ${i}`,
        email: `user${i}@user.fr`,
        password: 'Password1234.',
        role: 'user',
        isVerified: true,
        addresses: [
          {
            //id: crypto.randomUUID(),
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
              'createdAt',
              'updatedAt',
              'deletedAt',
            ],
          },
        ],
        transaction: t,
      });
      createdUsers.push(user);
    }

    await Users.create(
      {
        //id: crypto.randomUUID(),
        fullname: 'Admin ADMIN',
        email: 'admin@admin.fr',
        password: 'Password1234.',
        role: 'admin',
        isVerified: true,
        addresses: [
          {
            //id: crypto.randomUUID(),
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
              'createdAt',
              'updatedAt',
              'deletedAt',
            ],
          },
        ],
        transaction: t,
      },
    );

    await Users.create(
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
              'createdAt',
              'updatedAt',
              'deletedAt',
            ],
          },
        ],
        transaction: t,
      },
    );

    await Users.create(
      {
        //id: crypto.randomUUID(),
        fullname: 'User USER',
        email: 'user@user.fr',
        password: 'Password1234.',
        role: 'user',
        isVerified: true,
        addresses: [
          {
            //id: crypto.randomUUID(),
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
              'createdAt',
              'updatedAt',
              'deletedAt',
            ],
          },
        ],
        transaction: t,
      },
    );
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
