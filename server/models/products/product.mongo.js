import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.UUID,
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
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    get: (v) => {
      return v.toFixed(2);
    },
  },
});

const ProductMongo = mongoose.model('Product', ProductSchema);

export default ProductMongo;
