import { DataTypes } from 'sequelize';
import { underscore } from 'inflection';

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
  try {
    await sequelize.getQueryInterface().createSchema('public');
  } catch {
    /* empty */
  } finally {
    await sequelize.getQueryInterface().createTable('products_categories', {
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
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: underscore('createdAt'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: underscore('updatedAt'),
      },
    });

    await sequelize
      .getQueryInterface()
      .addIndex('products_categories', ['name'], {
        name: 'idx_unique_products_categories_name',
        unique: true,
      });

    await sequelize
      .getQueryInterface()
      .addIndex('products_categories', ['slug'], {
        name: 'idx_unique_products_categories_slug',
        unique: true,
      });
  }
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
};
