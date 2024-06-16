import { DataTypes } from 'sequelize';
import ProductsCategoriesMongo from '../models/mongo/products-categories.mongo.js';

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
  try {
    await queryInterface.createSchema('public');
  } catch {
    /* empty */
  }

  await queryInterface.createTable('products_categories', {
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

  await queryInterface.addIndex('products_categories', ['name'], {
    name: 'idx_unique_products_categories_name',
    unique: true,
  });

  await queryInterface.addIndex('products_categories', ['slug'], {
    name: 'idx_unique_products_categories_slug',
    unique: true,
  });
};

/**
 *
 * @param {MigrationParams} params
 *
 */
export const down = async ({ context: { sequelize } }) => {
  await sequelize
    .getQueryInterface()
    .dropTable('products_categories', { force: true });
  await ProductsCategoriesMongo.db.dropCollection(
    ProductsCategoriesMongo.collection.name,
  );
};
