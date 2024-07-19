const paypal = require('paypal-rest-sdk');
const httpErrors = require('http-errors');
const OrdersMongo = require('../models/mongo/orders.mongo');
const UsersMongo = require('../models/mongo/user.mongo');
const PaymentsMongo = require('../models/mongo/payment.mongo');
const sequelize = require('../models/sql');
const { NotFound } = httpErrors;
const Payments = sequelize.model("payments");
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
    const user = await UsersMongo.findById(paymentCreateBody.user);
    console.log("first log ",user)
    if (!user) {
      throw new NotFound('User not found');
    }

    const result = await sequelize.transaction(async (t) => {
      const order = await OrdersMongo.findOne({ user: user })
        .sort({ createdAt: -1 })
        .exec();
        console.log("sec log ",order)
      if (!order) {
        throw new NotFound('Order not found');
      }

      const totalPrice = order.items.reduce((total, item) => {
        return total + parseFloat(item.price.toString());
      }, 0);

      const payment = await Payments.create({
        userId: user._id,
        orderId: order._id,
        paymentStatus: 'Pending',
        totalPrice: totalPrice.toFixed(2),
      }, { transaction: t });
      console.log("third log ",payment)
      const paymentMongo = {
        _id: payment.id,
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
        },
        order: order.items.map((item) => ({
          _id: item._id,
          name: item.name,
          category: {
            _id: item.category._id,
            name: item.category.name,
            slug: item.category.slug,
          },
          price: item.price,
        })),
        paymentStatus: 'Pending',
        totalPrice: totalPrice.toFixed(2),
      };
      console.log("quartuor log ",paymentMongo)
      const paymentDoc = await PaymentsMongo.create(paymentMongo);
      console.log("cinq log ",paymentDoc)

      //paypal dynamique 
      const create_payment_json = {
        intent: 'sale',
        payer: { payment_method: 'paypal' },
        redirect_urls: {
          return_url: process.env.VITE_API_BASE_URL.toString(),
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
            description: `commande Order : ${order._id}`,
          },
        ],
      };
      console.log("SIX LOG", create_payment_json)
      return new Promise((resolve, reject) => {
        paypal.payment.create(create_payment_json, async (error, payment) => {
          if (error) {
            console.error('PayPal create payment error:', error);
            await t.rollback();
            return reject(new Error('Failed to create PayPal payment'));
          } else {
            for (let link of payment.links) {
              if (link.rel === 'approval_url') {
                await t.commit();
                return resolve({ redirectUrl: link.href, payment: paymentDoc });
              }
            }
            await t.rollback();
            return reject(new Error('No approval_url found in PayPal payment response'));
          }
      
        });
      });
    
    });

    return res.status(201).json(result);
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
