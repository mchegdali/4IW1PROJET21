import { z } from 'zod';
import zodErrorMap from './utils/zod-error-map.js';
import { connectToMongo } from './mongo.js';
import { connectToSQL } from './sequelize.js';

/**
 * Initialize various parts of the application
 */
async function init() {
  await Promise.all([connectToMongo(), connectToSQL()]);

  z.setErrorMap(zodErrorMap);
}

export default init;
