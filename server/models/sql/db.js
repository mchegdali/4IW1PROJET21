require('dotenv').config();

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRES_URL);

sequelize.authenticate().then(() => {
  console.log('[SQL] Connected to database');
});

module.exports = sequelize;
