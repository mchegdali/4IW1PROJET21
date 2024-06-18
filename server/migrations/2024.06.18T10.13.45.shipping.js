/* eslint-disable no-unused-vars */
import { DataTypes } from 'sequelize';
import ShippingMongo from '../models/mongo/shipping.js';

/**
 * @typedef { Object } MigrationParams
 * @property { string } name
 * @property { string } [path]
 * @property { Object } context
 * @property { import('sequelize').Sequelize } context.sequelize
 */

/**
 *
 * @param {MigrationParams} params
 *
 */

export const up = async ({ context: { sequelize } }) => {
 const queryInterface = sequelize.getQueryInterface();
  await queryInterface.createTable('shippings', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.fn('gen_random_uuid'),
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailCustomer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('NOW'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('NOW'),
    },
    
  });
};

/**
 *
 * @param {MigrationParams} params
 *
 */
export const down = async ({ context: { sequelize } }) => {
  await sequelize.getQueryInterface().dropTable('shippings', { force: true });
  await ShippingMongo.db.dropCollection(ShippingMongo.collection.name);
};
 