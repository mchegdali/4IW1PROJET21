/* eslint-disable no-unused-vars */
const { DataTypes } = require('sequelize');
const crypto = require('node:crypto');
const StatusMongo = require('../../models/mongo/status.mongo');

/**
 * @typedef { Object } MigrationParams
 * @property { string } name
 * @property { string } [path]
 * @property { Object } context
 * @property { import('sequelize').Sequelize } context.sequelize
 * @property { import('mongoose').Mongoose } context.mongoose
 */

/**
 *
 * @param {MigrationParams} params
 *
 */
const up = async ({ context: { sequelize } }) => {
  const queryInterface = sequelize.getQueryInterface();
  const StatusSequelize = sequelize.model('status');
  
  const statuses = [
    {
      id: crypto.randomUUID(),
      label: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      label: 'Shipped',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      label: 'Delivered',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      label: 'Cancelled',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await sequelize.transaction(async (t) => {
    const createdStatusesSequelize = await StatusSequelize.bulkCreate(statuses, {
      validate: true,
      transaction: t,
    });

    const createdStatusesMongo = createdStatusesSequelize.map((status) => ({
      _id: status.id,
      label: status.label,
      createdAt: status.createdAt,
      updatedAt: status.updatedAt,
    }));

    await StatusMongo.insertMany(createdStatusesMongo);
  });

};

/**
 *
 * @param {MigrationParams} params
 *
 */
const down = async ({ context: { sequelize, mongoose } }) => {
  const StatusSequelize = sequelize.model('status');
  await StatusSequelize.destroy({ truncate: true, cascade: true, force: true });
  await StatusMongo.deleteMany({});
};

module.exports = { up, down };
