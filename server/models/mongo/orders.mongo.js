const mongoose = require('mongoose');
const connection = require('./db');

const OrderSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
    },
    deliveryDate: {
      type: Date,
      default: null,
    },
    shippingDate: {
      type: Date,
      default: null,
    },
    address: {
      type: {
        _id: {
          type: mongoose.Schema.Types.UUID,
          required: true,
        },
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },

        region: {
          type: String,
          required: true,
        },
        country: {
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
      },
    },
    user: {
      type: {
        _id: {
          type: mongoose.Schema.Types.UUID,
          required: true,
        },
        fullname: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
      },
    },
    status: {
      type: {
        _id: {
          type: mongoose.Schema.Types.UUID,
          required: true,
        },
        label: {
          type: String,
          required: true,
        },
      },
    },
    totalPrice: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    items: [
      {
        type: {
          _id: {
            type: mongoose.Schema.Types.UUID,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          quantity: {
            type: mongoose.Schema.Types.Number,
            require: true,
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
      },
    ],
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

const OrderMongo = connection.model('Order', OrderSchema);

module.exports = OrderMongo;
