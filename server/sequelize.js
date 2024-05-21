import { Sequelize } from 'sequelize';

if (!process.env.POSTGRES_CONNECTION_STRING) {
  throw new Error('POSTGRES_CONNECTION_STRING is not set');
}

const sequelize = new Sequelize(process.env.POSTGRES_CONNECTION_STRING);

async function connectToSQL() {
  await sequelize.authenticate();
  await sequelize.sync();
}

export { sequelize, connectToSQL };
