const mongoose = require('mongoose');
const connection = require('./db');

const OrderSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      required: true,
    },
    itemsProduct: [{
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
        image: {
          type: String,
          required: true,
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
    user: [{
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
    }]
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

const BasketMongo = connection.model('Basket', OrderSchema);

module.exports = BasketMongo;
