const mongoose = require('mongoose');
const connection = require('./db');

const StatusSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      required: true,
    },
    label: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    toObject: {
      getters: true,
    },
    toJSON: {
      getters: true,
    },
    timestamps: true,
  },
);

const StatusMongo = connection.model('Status', StatusSchema);

module.exports = StatusMongo;
