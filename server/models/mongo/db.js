const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URL, {
    dbName: process.env.MONGODB_DBNAME,
  })
  .then(() => {
    console.log('[MongoDB] Connected to database');
  })
  .catch((err) => {
    console.error('[MongoDB] Error connecting to database', err);
    process.exit(1);
  });

module.exports = mongoose;
