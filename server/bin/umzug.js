const fs = require('node:fs');
const path = require('node:path');
const { Umzug, MongoDBStorage } = require('umzug');
const sequelize = require('../models/sql');
const mongoose = require('mongoose');

async function umzug() {
  const _mongoose = await mongoose.connect(process.env.MONGODB_URL, {
    dbName: process.env.MONGODB_DBNAME,
  });

  const connection = _mongoose.connection.db;

  // const migrator = new Umzug({
  //   create: {
  //     folder: 'migrations',
  //     template: (filepath) => [
  //       [
  //         filepath,
  //         fs
  //           .readFileSync(path.join(__dirname, 'templates/migration'))
  //           .toString(),
  //       ],
  //     ],
  //   },
  //   migrations: {
  //     glob: ['migrations/*', { cwd: __dirname }],
  //   },
  //   context: {
  //     sequelize: db,
  //   },
  //   storage: new MongoDBStorage({
  //     connection,
  //     collectionName: 'migrations',
  //   }),
  //   logger: console,
  // });

  const seeder = new Umzug({
    create: {
      folder: 'seeders',
      template: (filepath) => [
        [
          filepath,
          fs.readFileSync(path.join(__dirname, 'templates/seeder')).toString(),
        ],
      ],
    },
    migrations: {
      glob: ['seeders/*', { cwd: __dirname }],
    },
    context: {
      sequelize,
      mongoose,
    },
    storage: new MongoDBStorage({
      connection,
      collectionName: 'seeders',
    }),
    logger: console,
  });

  return {
    // migrator,
    seeder,
  };
}

module.exports = umzug;
