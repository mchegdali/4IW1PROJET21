import mongoose from 'mongoose';

const ProductsCategoriesSchema = new mongoose.Schema(
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

ProductsCategoriesSchema.index(
  { name: 'text', slug: 'text' },
  {
    name: 'products_categories_search_index',
    weights: { name: 1, slug: 1 },
  },
);

const ProductsCategoriesMongo = mongoose.model(
  'ProductsCategories',
  ProductsCategoriesSchema,
);

export default ProductsCategoriesMongo;
