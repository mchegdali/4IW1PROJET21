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
  await queryInterface.addColumn('products_categories', 'description', {
    type: DataTypes.TEXT,
    allowNull: false,
  });
};

/**
 *
 * @param {MigrationParams} params
 *
 */
export const down = async ({ context: { sequelize } }) => {
  const queryInterface = sequelize.getQueryInterface();
  await queryInterface.removeColumn('products_categories', 'description');
};
