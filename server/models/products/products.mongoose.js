import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      required: true,
      default: () => new mongoose.Types.UUID(),
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
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

// ProductSchema.

ProductSchema.index(
  { title: 'text', description: 'text', category: 'text' },
  {
    name: 'products_search_index',
    weights: { title: 10, description: 5, category: 1 },
    default_language: 'fr',
  },
);

const ProductMongo = mongoose.model('Product', ProductSchema);

export default ProductMongo;
