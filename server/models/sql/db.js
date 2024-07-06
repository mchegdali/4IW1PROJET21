const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: 'postgres',
});

sequelize.authenticate().then(() => {
  console.log('[SQL] Connected to database');
});

module.exports = sequelize;
