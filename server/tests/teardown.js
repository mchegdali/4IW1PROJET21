const sequelize = require('../models/sql');
const connection = require('../models/mongo/db');

module.exports = async () => {
  console.log('Cleaning up database...');
  try {
    for (const model of Object.values(sequelize.models)) {
      await model.destroy({ truncate: true, cascade: true, force: true });
    }
    await sequelize.close();
    await connection.close();
    console.log('Database cleanup completed successfully.');
  } catch (error) {
    console.error('Database cleanup failed:', error);
    process.exit(1);
  }
};
