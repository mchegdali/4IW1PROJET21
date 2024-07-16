const mongoose = require('mongoose');
const connection = require('./db');

const OrderSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      required: true,
    },
  
    user: {
      type:  {
          _id: {
              type: mongoose.Schema.Types.UUID,
              required: true,
          },
          fullname: {
              type : String,
              required: true,
          },
          email: {
              type: String,
              required: true,
          },
      }
    },
    orderStatus: {
      type: String,
      required: true,
    },
    deliveryStatus: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
    items: [{
      type:  {
        _id: {
          type: mongoose.Schema.Types.UUID,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        category: {
          type: {
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
          default: null,
        },
        price: {
          type: mongoose.Schema.Types.Decimal128,
          required: true,
          /**
           *
           * @param {import('mongoose').Types.Decimal128} v
           */
          get(v) {
            return v.toString();
          },
        },
      }
    }],
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

const OrderMongo = connection.model('Order', OrderSchema);

module.exports = OrderMongo;
