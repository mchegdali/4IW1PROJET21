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
  const queryInterface = sequelize.getQueryInterface();
  try {
    await queryInterface.createSchema('public');
  } catch {
    /* empty */
  } finally {
    /*
     add your migration here
    */
  }
};

/**
 *
 * @param {MigrationParams} params
 *
 */
export const down = async ({ context: { sequelize } }) => {};
