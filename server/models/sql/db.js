import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.POSTGRES_URL);

await sequelize.authenticate();

export default sequelize;
