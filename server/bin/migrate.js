const sequelize = require('../models/sql');

sequelize
  .authenticate()
  .then(() => sequelize.sync({ alter: true }))
  .then(() => sequelize.close())
  .then(() => {
    console.log('[SQL] Migrations completed');
  });
