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
  try {
    /*
     add your seeder here
    */

    await sequelize.transaction(async (t) => {});
  } catch {
    /* add your rollback code here, should be same as down */
  }
};

/**
 *
 * @param {MigrationParams} params
 *
 */
const down = async ({ context: { sequelize, mongoose } }) => {};

module.exports = { up, down };
