import { DataTypes } from 'sequelize';
import ProductMongo from '../models/mongo/products.mongo.js';

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
  await queryInterface.createTable('products', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.fn('gen_random_uuid'),
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL.UNSIGNED,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
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
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      references: {
        model: {
          tableName: 'products_categories',
          schema: 'public',
        },
        key: 'id',
      },
    },
  });
};

/**
 *
 * @param {MigrationParams} params
 *
 */
export const down = async ({ context: { sequelize } }) => {
  await sequelize.getQueryInterface().dropTable('products', { force: true });
  await ProductMongo.db.dropCollection(ProductMongo.collection.name);
};
