/* eslint-disable no-unused-vars */
const { DataTypes } = require('sequelize');

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
const down = async ({ context: { sequelize, mongoose } }) => {};

module.exports = { up, down };
