require('dotenv').config();

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development',
});

// sequelize.authenticate().then(() => {
//   console.log('[SQL] Connected to database');
// });

module.exports = sequelize;
