import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

/**
 * @type {Sequelize}
 */
let sequelize = null;

async function connectToDb() {
  if (!process.env.MONGODB_CONNECTION_STRING) {
    throw new Error('MONGODB_CONNECTION_STRING is not set');
  }

  if (!process.env.POSTGRES_CONNECTION_STRING) {
    throw new Error('POSTGRES_CONNECTION_STRING is not set');
  }

  sequelize = new Sequelize(process.env.POSTGRES_CONNECTION_STRING);

  await Promise.all([
    sequelize.authenticate(),
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
      dbName: 'fanthesie',
      auth: {
        username: process.env.MONGODB_USER,
        password: process.env.MONGODB_PASSWORD,
      },
    }),
  ]);
}

export { sequelize, connectToDb };
