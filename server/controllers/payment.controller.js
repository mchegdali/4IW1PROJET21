const paypal = require('paypal-rest-sdk');
const httpErrors = require('http-errors');
const OrdersMongo = require('../models/mongo/orders.mongo'); 
const UsersMongo = require ("../models/mongo/user.mongo")
const { NotFound } = httpErrors;
const sequelize = require ("../models/sql");
const Payment = sequelize.model("payments")
paypal.configure({
  mode: 'sandbox', 
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET,
});
const {
  paymentQuerySchema,
  paymentCreateSchema,
  paymentUpdateSchema,
} = require('../schemas/payments.schema');

const createPayment = async (req, res, next) => {
  try {
    const paymentCreateBody = await paymentCreateSchema.parseAsync(req.body);
    console.log("test : ",paymentCreateBody)
    const user = await UsersMongo.findById(paymentCreateBody.user);
    console.log("first log", user);
    if (!user) {
      throw new NotFound('User not found');
    }

    const order = await OrdersMongo.findOne({ user: user })
      .sort({ createdAt: -1 })
      .exec();
    if (!order) {
      throw new NotFound('Order not found');
    }

    console.log('Found order:', order);
    console.log('Found user:', user);

    // Verify that the order has required fields
    if (!order._id || !order.deliveryStatus || !order.orderStatus) {
      throw new Error('Order validation failed: missing required fields');
    }

    const totalPrice = order.items.reduce((total, item) => {
      return total + parseFloat(item.price.toString());
    }, 0);

    const paymentMongo = {
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
      order: {
        _id: order._id,
        paymentStatus: order.paymentStatus,
        deliveryStatus: order.deliveryStatus,
        orderStatus: order.orderStatus,
        items: order.items.map((item) => ({
          _id: item._id,
          name: item.name,
          category: {
            _id: item.category._id,
            name: item.category.name,
            slug: item.category.slug,
          },
          price: item.price,
        })),
      },
      paymentStatus: 'Pending',
      totalPrice: totalPrice.toFixed(2),
    };
console.log("payment mongo ",paymentMongo)
    const paymentDoc = await Payment.create(paymentMongo);

    // Prepare PayPal payment JSON
    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
      },
      transactions: [
        {
          item_list: {
            items: order.items.map((item) => ({
              name: item.name,
              sku: item._id.toString(),
              price: parseFloat(item.price.toString()).toFixed(2),
              currency: 'EUR',
              quantity: 1,
            })),
          },
          amount: {
            currency: 'EUR',
            total: totalPrice.toFixed(2),
          },
          description: `Order ID: ${order._id}`,
        },
      ],
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
      if (error) {
        console.error('PayPal create payment error:', error);
        throw new Error('Failed to create PayPal payment');
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            return res.json({ redirectUrl: payment.links[i].href, payment: paymentDoc });
          }
        }
        throw new Error('No approval_url found in PayPal payment response');
      }
    });

  } catch (error) {
    console.error('createPayment error:', error);
    return next(error);
  }
};

const executePayment = async (req, res) => {
  console.log("execute payment ",req.body,"req.parmas",req.params.paymentId)
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  const { orderId } = req.body.orderId;

  try {
    
    const order = await OrdersMongo.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const totalPrice = order.items.reduce((total, item) => {
      return total + parseFloat(item.price);
    }, 0);

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: 'USD',
            total: totalPrice.toFixed(2),
          },
        },
      ],
    };

    paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
      if (error) {
        console.error(error.response);
       
        order.paymentStatus = 'payment-failed';
        await order.save();
        res.status(500).json({ error: 'Payment execution failed' });
      } else {

        order.paymentStatus = 'paid';
        await order.save();
        res.json({ message: 'Payment successful', payment });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createPayment, executePayment };
