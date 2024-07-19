const mongoose = require('mongoose');

const connection = mongoose.createConnection(process.env.MONGODB_URL, {
  dbName: process.env.MONGODB_DBNAME,
});

mongoose.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = connection;
