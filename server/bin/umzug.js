import fs from 'node:fs';
import path from 'node:path';
import { Umzug, MongoDBStorage } from 'umzug';
import { db, initModels } from '../models/sql/index.js';
import mongoose from '../models/mongo/db.js';

const connection = mongoose.connection.db;

// const migrator = new Umzug({
//   create: {
//     folder: 'migrations',
//     template: (filepath) => [
//       [
//         filepath,
//         fs
//           .readFileSync(
//             path.join(import.meta.dirname, 'templates/migration.js'),
//           )
//           .toString(),
//       ],
//     ],
//   },
//   migrations: {
//     glob: ['migrations/*.js', { cwd: import.meta.dirname }],
//   },
//   context: {
//     sequelize,
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
        fs
          .readFileSync(path.join(import.meta.dirname, 'templates/seeder.js'))
          .toString(),
      ],
    ],
  },
  migrations: {
    glob: ['seeders/*.js', { cwd: import.meta.dirname }],
  },
  context: async () => {
    await initModels();
    db.connection.sync();

    return {
      sequelize: db,
      mongoose,
    };
  },
  storage: new MongoDBStorage({
    connection,
    collectionName: 'seeders',
  }),
  logger: console,
});

export { seeder };
// export { migrator, seeder };
