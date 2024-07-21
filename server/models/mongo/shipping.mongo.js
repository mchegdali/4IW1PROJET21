const mongoose = require('mongoose');
const connection = require('./db');
const shippingSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      required: true,
    },
    address: {
      type: {
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
    },
    deliveryChoice: {
      type: {
        _id: {
          type: mongoose.Schema.Types.UUID,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
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

const shipping = connection.model('shippings', shippingSchema);
module.exports = shipping;
