// import sequelize from '../models/sql/db.js';
import { initModels, db } from '../models/sql/index.js';

await initModels();
await db.connection.sync({ alter: true });
