import mongoose from 'mongoose';



const shippingSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.UUID,
      required: true,
    },
    emailCustomer: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },

    street: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    deliveryChoiceShipping: {
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
shippingSchema.index(
  {
    title: 'text',
    description: 'text',
  },
  {
    name: 'shipping_search_index',
    weights: {
      title: 10,
      description: 5,
    },
  },
);

const shipping = mongoose.model('shipping', shippingSchema);
module.exports = shipping;
