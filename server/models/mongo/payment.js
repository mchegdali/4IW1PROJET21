const mongoose = require('mongoose');
const connection = require('./db');

const paymentSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      required: true,
    },
    shippingMode: {
      type: String,
      enum: ['Colissimo', 'Mondial Relay'],
      required: true,
    },
    paymentMode: {
      type: [String],
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
paymentSchema.index(
  {
    title: 'text',
    description: 'text',
  },
  {
    name: 'shipping_search_index',
    weights: {
      title: 10,
      description: 5,
    },
  },
);

const Payment = connection.model('shipping', paymentSchema);
module.exports = Payment;
