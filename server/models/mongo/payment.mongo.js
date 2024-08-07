const mongoose = require('mongoose');
const connection = require('./db');

const paymentSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      required: true,
      auto: true,
    },
    user: {
      type: {
        _id: {
          type: mongoose.Schema.Types.UUID,
          required: true,
        },
        fullname: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    order: [
      {
        _id: {
          type: mongoose.Schema.Types.UUID,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        category: {
          _id: {
            type: mongoose.Schema.Types.UUID,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          slug: {
            type: String,
            required: true,
          },
        },
        price: {
          type: mongoose.Schema.Types.Decimal128,
          required: true,
          get(v) {
            return v.toString();
          },
        },
      },
    ],
    paymentStatus: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get(v) {
        return v.toString();
      },
    },
  },
  {
    toObject: { getters: true },
    toJSON: { getters: true },
  }
);

const Payment = connection.model('Payment', paymentSchema);
module.exports = Payment;
