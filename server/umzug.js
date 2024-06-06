import fs from 'node:fs';
import path from 'node:path';
import { Umzug, MongoDBStorage } from 'umzug';
import { sequelize } from './sequelize.js';
import { connectToMongo } from './mongo.js';

const mongoose = await connectToMongo();

const connection = mongoose.connection.db;

const migrator = new Umzug({
  create: {
    folder: 'migrations',
    template: (filepath) => [
      [
        filepath,
        fs
          .readFileSync(
            path.join(import.meta.dirname, 'templates/migration.js'),
          )
          .toString(),
      ],
    ],
  },
  migrations: {
    glob: ['migrations/*.js', { cwd: import.meta.dirname }],
  },
  context: {
    sequelize,
  },
  storage: new MongoDBStorage({
    connection,
    collectionName: 'migrations',
  }),
  logger: console,
});

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

export { migrator, seeder };
