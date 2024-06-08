import mongoose from 'mongoose';

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
    timestamps: true,
  },
);

ProductSchema.index(
  { name: 'text', description: 'text', 'category.name': 'text' },
  {
    name: 'products_search_index',
    weights: { name: 100, description: 25, 'category.name': 50 },
    default_language: 'french',
  },
);

const ProductMongo = mongoose.model('Product', ProductSchema);

export default ProductMongo;
