const mongoose = require('./db');

const OrderSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      required: true,
    },
  
    user: {
      type:  {
          _id: {
              type: mongoose.Schema.Types.UUID,
              required: true,
          },
          fullname: {
              type : String,
              required: true,
          },
          email: {
              type: String,
              required: true,
          },
      }
    },
    orderStatus: {
      type: String,
      required: true,
    },
    deliveryStatus: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
    itemsProduct: [{
      type:  {
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
      }
    }],
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

const OrderMongo = mongoose.model('Order', OrderSchema);

module.exports = OrderMongo;
