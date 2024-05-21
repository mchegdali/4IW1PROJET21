import { z } from 'zod';
import errorMap from './utils/zod-error-map.js';
import { connectToMongo } from './mongo.js';
import { connectToSQL, sequelize } from './sequelize.js';

/**
 * Initialize various parts of the application
 */
async function init() {
  await Promise.all([connectToMongo(), connectToSQL()]);

  z.setErrorMap(errorMap);
}

export default init;
