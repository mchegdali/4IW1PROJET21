/* eslint-disable no-unused-vars */
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
  /* ONLY ADD CREATE SCHEMA AT FIRST MIGRATION */
  // await sequelize.query('CREATE SCHEMA IF NOT EXISTS public');

  /*
     add your migration here
    */
};

/**
 *
 * @param {MigrationParams} params
 *
 */
export const down = async ({ context: { sequelize } }) => {};
