const mongoose = require('mongoose');
const connection = require('./db');
const crypto = require('node:crypto');

const ProductSchema = new mongoose.Schema(
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

const StockItemSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      required: true,
      default: () => {
        return crypto.randomUUID();
      },
    },
    product: {
      type: ProductSchema,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index
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

const StockItemMongo = connection.model('StockItem', StockItemSchema);

module.exports = StockItemMongo;
