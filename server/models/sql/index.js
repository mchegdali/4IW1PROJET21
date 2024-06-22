import fs from 'node:fs/promises';

import sequelize from './db.js';

const db = {
  connection: sequelize,
};

async function importDefault(filePath) {
  const module = await import(filePath);
  return module.default;
}

async function initModels() {
  const files = await fs.readdir(import.meta.dirname);

  const importsPromises = [];

  for (const file of files) {
    if (file.endsWith('.sql.js')) {
      importsPromises.push(importDefault(`./${file}`));
    }
  }

  const modelFunctions = await Promise.all(importsPromises);

  for (const modelFunction of modelFunctions) {
    const model = modelFunction(db.connection);
    db[model.name] = model;
  }

  for (const key in db) {
    if (db[key].associate) {
      db[key].associate(db);
    }
  }
}

export { db, initModels };
