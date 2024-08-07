const mongoose = require('mongoose');
const connection = require('./db');

const ProductSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
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
    origin: {
      type: String,
      required: true,
    },
    brewingInstructions: {
      temperature: {
        type: Number,
        required: true,
      },
      steepTime: {
        type: Number,
        required: true,
      },
    },
    weightGrams: {
      type: Number,
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
    timestamps: true,
  },
);

ProductSchema.index(
  { name: 'text', description: 'text' },
  // { name: 'text', description: 'text', 'category.name': 'text' },
  {
    name: 'products_search_index',
    weights: { name: 100, description: 25 },
  },
);

const ProductMongo = connection.model('Product', ProductSchema);

module.exports = { ProductMongo, ProductSchema };
