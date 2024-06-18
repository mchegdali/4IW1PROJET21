import { DataTypes } from 'sequelize';

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
export const up = async ({ context: { sequelize } }) => {
  const queryInterface = sequelize.getQueryInterface();
  try {
    /*
     add your seeder here
    */
  } catch {
    /* empty */
  }
};

/**
 *
 * @param {MigrationParams} params
 *
 */
export const down = async ({ context: { sequelize, mongoose } }) => {};
