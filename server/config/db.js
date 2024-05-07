import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';

const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING);

/**
 * @type {mongoose}
 */
let mongoDb;

async function initDb() {
  if (!process.env.MONGO_CONNECTION_STRING) {
    throw new Error('MONGO_CONNECTION_STRING is not set');
  }

  try {
    const [, mongooseConnection] = await Promise.all([
      sequelize.authenticate(),
      mongoose.connect(process.env.MONGO_CONNECTION_STRING),
    ]);
    mongoDb = mongooseConnection;
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

export { sequelize, mongoDb, initDb };
