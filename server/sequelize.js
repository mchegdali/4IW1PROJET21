import { Sequelize } from 'sequelize';

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL is not set');
}

const sequelize = new Sequelize(process.env.POSTGRES_URL);

async function connectToSQL() {
  await sequelize.authenticate();
}

export { sequelize, connectToSQL };
