import { fakerFR as faker } from '@faker-js/faker';
import { hashSync } from '@node-rs/argon2';
import UserMongo from '../../models/mongo/user.mongo.js';
import authConfig from '../../config/auth.config.js';

/**
 * @typedef { Object } MigrationParams
 * @property { string } name
 * @property { string } [path]
 * @property { Object } context
 */

/**
 *
 * @param {MigrationParams} params
 *
 */
export const up = async ({ context: { sequelize } }) => {
  const queryInterface = sequelize.connection.getQueryInterface();
  const users = [];
  const addresses = [];

  users.push(
    {
      id: crypto.randomUUID(),
      fullname: 'User USER',
      email: 'user@user.fr',
      password: hashSync('Password1234.', authConfig.hashOptions),
      role: 'user',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      fullname: 'Admin ADMIN',
      email: 'admin@admin.fr',
      password: hashSync('Password1234.', authConfig.hashOptions),
      role: 'admin',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      fullname: 'Accountant ACCOUNTANT',
      email: 'accountant@accountant.fr',
      password: hashSync('Password1234.', authConfig.hashOptions),
      role: 'accountant',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  );

  addresses.push(
    {
      id: crypto.randomUUID(),
      userId: users[0].id,
      street: faker.location.streetAddress(true),
      city: faker.location.city(),
      zipCode: faker.location.zipCode(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      userId: users[1].id,
      street: faker.location.streetAddress(true),
      city: faker.location.city(),
      zipCode: faker.location.zipCode(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      userId: users[2].id,
      street: faker.location.streetAddress(true),
      city: faker.location.city(),
      zipCode: faker.location.zipCode(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  );

  await sequelize.connection.transaction(async (t) => {
    const createdUsers = await queryInterface.bulkInsert('users', users, {
      validate: true,
      returning: true,
      transaction: t,
    });

    const createdAddresses = await queryInterface.bulkInsert(
      'addresses',
      addresses,
      {
        validate: true,
        returning: true,
        transaction: t,
      },
    );

    const createdUsersMongo = createdUsers.map((p) => ({
      _id: p.id,
      fullname: p.fullname,
      email: p.email,
      password: p.password,
      passwordValidUntil: p.passwordValidUntil,
      role: p.role,
      isVerified: p.isVerified,
      addresses: createdAddresses
        .filter((a) => a.usersId === p.id)
        .map((a) => ({
          id: a.id,
          street: a.street,
          city: a.city,
          zipCode: a.zipCode,
        })),
    }));

    await UserMongo.insertMany(createdUsersMongo);
  });
};

/**
 *
 * @param {MigrationParams} params
 *
 */
export const down = async ({ context: { sequelize } }) => {
  const queryInterface = sequelize.connection.getQueryInterface();
  await queryInterface.bulkDelete('users', null, {});
  await UserMongo.deleteMany({});
};
