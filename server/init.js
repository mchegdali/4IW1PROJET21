import { z } from 'zod';
import zodErrorMap from './utils/zod-error-map.js';
import { connectToMongo } from './mongo.js';
import { connectToSQL } from './sequelize.js';

/**
 * Initialize various parts of the application
 */
async function init() {
<<<<<<< HEAD
  await Promise.all([connectToMongo(), connectToSQL()]);
=======
  await Promise.all([
    connectToMongo(process.env.MONGODB_URL, process.env.MONGODB_DBNAME),
    connectToSQL(),
  ]);
>>>>>>> 1381fce (IW1S2G21-68 add confirm email)

  z.setErrorMap(zodErrorMap);
}

export default init;
