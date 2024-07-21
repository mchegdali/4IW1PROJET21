const mongoose = require('mongoose');
const connection = require('./db');
const addressesSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      required: true,
    },
    firstName:{
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },

    region:{
        type: String,
        required: true,
    },
    country:{
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
      },

  {
    toObject: {
      getters: true,
    },
    toJSON: {
      getters: true,
    },
  },
);

const adresseses = connection.model('addresses', addressesSchema);
module.exports = adresseses;
