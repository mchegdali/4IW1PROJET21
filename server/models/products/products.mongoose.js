import { mongoDb } from '../../db';

const ProductSchema = new mongoDb.Schema({
  _id: {
    type: mongoDb.Schema.Types.UUID,
    required: true,
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
    type: mongoDb.Schema.Types.Decimal128,
    required: true,
    get: (v) => {
      return v.toFixed(2);
    },
  },
});

ProductSchema.index(
  { title: 'text', description: 'text', category: 'text' },
  {
    name: 'products_search_index',
    weights: { title: 10, description: 5, category: 1 },
  },
);

const ProductMongo = mongoDb.model('Product', ProductSchema);

export default ProductMongo;
