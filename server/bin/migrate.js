const sequelize = require('../models/sql');

async function migrate() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
}

migrate()
  .then(() => {
    console.log('[SQL] Migrations completed successfully.');
    sequelize.close();
    process.exit(0);
  })
  .catch((error) => {
    console.error('[SQL] Migrations failed:', error);
    sequelize.close();
    process.exit(1);
  });
