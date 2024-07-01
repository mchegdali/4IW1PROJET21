const sequelize = require('../models/sql');

sequelize
  .sync({ alter: true })
  .then((sequelize) => sequelize.close())
  .then(() => {
    console.log('[SQL] Migrations completed');
  });
