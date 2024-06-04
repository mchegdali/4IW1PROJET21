/**
 * @typedef { import('umzug').MigrationParams<> } MigrationParams
 */

/**
 *
 * @param {Object} params
 * @param {string} params.name
 * @param {string} [params.path]
 * @param {Object} params.context
 * @param {import('sequelize').Sequelize} params.context.sequelize
 * @param {import("mongoose").Mongoose} params.context.mongoose
 *
 */
export const up = async ({ context }) => {
  console.log(await context.sequelize.query('SELECT 1=1;'));
};

/**
 *
 * @param {Object} params
 * @param {string} params.name
 * @param {string} [params.path]
 * @param {Object} params.context
 * @param {import('sequelize').Sequelize} params.context.sequelize
 * @param {import("mongoose").Mongoose} params.context.mongoose
 *
 *
 */
export const down = async ({ context }) => {
  console.log(await context.sequelize.query('SELECT 1=1;'));
};
