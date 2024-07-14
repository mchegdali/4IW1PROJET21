const mongoose = require('mongoose');
const connection = require('./db');

const CategoriesSchema = new mongoose.Schema(
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

CategoriesSchema.index(
  { name: 'text', slug: 'text' },
  {
    name: 'categories_search_index',
    weights: { name: 1, slug: 1 },
  },
);

const CategoriesMongo = connection.model('Categories', CategoriesSchema);

module.exports = CategoriesMongo;
