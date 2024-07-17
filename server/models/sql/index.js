const fs = require('node:fs');
const path = require('node:path');
const sequelize = require('./db.js');

const files = fs.readdirSync(__dirname);

for (const file of files) {
  if (file.endsWith('.sql.js')) {
    require(path.join(__dirname, file))(sequelize);
  }
}

for (let modelName in sequelize.models) {
  if (sequelize.models[modelName] === sequelize) continue;
  if (typeof sequelize.models[modelName].associate === 'function') {
    sequelize.models[modelName].associate(sequelize.models);
  }
}

module.exports = sequelize;
