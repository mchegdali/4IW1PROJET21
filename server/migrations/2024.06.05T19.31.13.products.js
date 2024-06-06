import { underscore } from 'inflection';
import { DataTypes } from 'sequelize';

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
      defaultValue: DataTypes.UUIDV4,
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
      defaultValue: sequelize.literal(sequelize.fn('NOW')).val,
      field: underscore('createdAt'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal(sequelize.fn('NOW')).val,
      field: underscore('updatedAt'),
    },
    categoryId: {
      type: DataTypes.UUID,
      field: underscore('categoryId'),
      allowNull: false,
      references: {
        model: 'products_categories',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  });

  await queryInterface.addIndex('products', ['slug'], {
    name: 'idx_unique_products_slug',
    unique: true,
  });
};

/**
 *
 * @param {MigrationParams} params
 *
 */
export const down = async ({ context: { sequelize } }) => {
  await sequelize.getQueryInterface().dropTable('products', { force: true });
};
