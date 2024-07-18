const paypal = require('paypal-rest-sdk');
const httpErrors = require('http-errors');
const OrdersMongo = require('../models/mongo/orders.mongo'); 
const { NotFound } = httpErrors;
paypal.configure({
  mode: 'sandbox', 
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET,
});
const createPayment = async (req, res) => {
  const  orderId  = req.body.orderId;

  try {

    const order = await OrdersMongo.findById(orderId);
    console.log(order)
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const totalPrice = order.items.reduce((total, item) => {
      return total + parseFloat(item.price);
    }, 0);

    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url:  'http://localhost:3000/success',
        cancel_url:  'http://localhost:3000/cancel',
      },
      transactions: [
        {
          item_list: {
            items: order.items.map(item => ({
              name: item.name,
              sku: item._id,
              price: parseFloat(item.price).toFixed(2),
              currency: 'USD', 
              quantity: 1,
            })),
          },
          amount: {
            currency: 'USD',
            total: totalPrice.toFixed(2),
          },
          description: `Order ID: ${orderId}`,
        },
      ],
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        console.log('error ' , error)
        throw new NotFound(); 
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            res.json({ redirectUrl: payment.links[i].href });
          }
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const executePayment = async (req, res) => {
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
