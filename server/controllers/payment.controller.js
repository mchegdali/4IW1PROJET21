const httpErrors = require('http-errors');
const sequelize = require('../models/sql');
const {
  paymentCreateSchema,
} = require('../schemas/payments.schema');
const { NotFound } = httpErrors;
const Payments = sequelize.model('payments');
const OrdersMongo = require('../models/mongo/orders.mongo');
const UsersMongo = require('../models/mongo/user.mongo');
const PaymentsMongo = require('../models/mongo/payment.mongo');
const StatusMongo = require('../models/mongo/status.mongo');
const ShippingsMongo = require('../models/mongo/shipping.mongo');
const Orders = sequelize.model("orders");
const Shippings = sequelize.model("shippings");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
const { createOrder } = require('../controllers/order.controller');
const { orderCreateSchema } = require('../schemas/orders.schema');


/**
 * @type {import('express').RequestHandler}
 */
async function createPayment(req, res, next) {
  try {
    const paymentCreateBody = await paymentCreateSchema.parseAsync(req.body);
    console.log('Validated paymentCreateBody:', paymentCreateBody);

    // Step 1: Create the order
    const orderCreateBody = {
      user: paymentCreateBody.user,
      shipping: paymentCreateBody.shippingId,
      paymentType: paymentCreateBody.paymentType
    };

    let order;
    try {
      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
         
        },
        body: JSON.stringify(orderCreateBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      order = await response.json();
      console.log('Order created:', order);
    } catch (error) {
      console.error('Error creating order:', error);
      return next(error);
    }

    // // Step 2: Clear the user's basket
    // const user = await UsersMongo.findById(paymentCreateBody.user);
    // if (user) {
    //   user.basket = [];
    //   await user.save();
    //   console.log('User basket cleared');
    // } else {
    //   console.warn('User not found, basket not cleared');
    // }

    // Step 3: Create Stripe session
    const line_items = order.items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(parseFloat(item.price) * 100),
      },
      quantity: item.quantity || 1,
    }));

    const url = new URL(process.env.APP_URL);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${url.toString()}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'http://localhost:3000/cancel',
      shipping_address_collection: {
        allowed_countries: ['US', 'BR', 'FR'],
      },
      metadata: {
        orderId: order._id,
      },
    });
    console.log(session)
    res.json({ id: session.id });
  } catch (error) {
    console.error('createPayment error:', error);
    return next(error);
  }
}

// Webhook to handle successful payments
async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Retrieve the order using the metadata
    const order = await OrdersMongo.findById(session.metadata.orderId);

    if (!order) {
      return res.status(404).send('Order not found');
    }

    // Update the order status to 'Paid'
    const paidStatus = await StatusMongo.findOne({ label: 'Paid' });
    if (paidStatus) {
      order.status = { _id: paidStatus._id, label: paidStatus.label };
      await order.save();
    }

    // Create the payment record
    await Payments.create({
      userId: order.user._id,
      orderId: order._id,
      paymentStatus: 'Completed',
      totalPrice: order.totalPrice,
    });

    // Create the payment record in MongoDB
    await PaymentsMongo.create({
      _id: session.id,
      user: order.user,
      order: order._id,
      paymentStatus: 'Completed',
      totalPrice: order.totalPrice,
    });
  }

  res.json({ received: true });
}

module.exports = {
  createPayment,
  handleStripeWebhook,
};
// const createPayment = async (req, res, next) => {
//   try {
//     const paymentCreateBody = await paymentCreateSchema.parseAsync(req.body);

//     const user = await UsersMongo.findById(paymentCreateBody.user);
//     if (!user) {
//       throw new NotFound('User not found');
//     }

//     const result = await sequelize.transaction(async (t) => {
//       // Create order and clear basket
//       const order = await createOrder(user._id);

//       const totalPrice = order.items.reduce((total, item) => {
//         return total + parseFloat(item.price.toString()) * (item.quantity || 1);
//       }, 0);

//       const payment = await Payments.create({
//         userId: user._id,
//         orderId: order._id,
//         paymentStatus: 'Pending',
//         totalPrice: totalPrice.toFixed(2),
//       }, { transaction: t });

//       const paymentMongo = {
//         _id: payment.id,
//         user: {
//           _id: user._id,
//           fullname: user.fullname,
//           email: user.email,
//         },
//         order: order.items.map((item) => ({
//           _id: item._id,
//           name: item.name,
//           category: {
//             _id: item.category._id,
//             name: item.category.name,
//             slug: item.category.slug,
//           },
//           price: item.price,
//         })),
//         paymentStatus: 'Pending',
//         totalPrice: totalPrice.toFixed(2),
//       };

//       const paymentDoc = await PaymentsMongo.create(paymentMongo);
//       return { paymentDoc, order };
//     });

//     const { paymentDoc, order } = result;

//     const itemCounts = order.items.reduce((acc, item) => {
//       const itemKey = item._id.toString();
//       if (acc[itemKey]) {
//         acc[itemKey].quantity += item.quantity || 1;
//       } else {
//         acc[itemKey] = {
//           name: item.name,
//           price: item.price,
//           quantity: item.quantity || 1,
//         };
//       }
//       return acc;
//     }, {});

//     const line_items = Object.values(itemCounts).map(item => ({
//       price_data: {
//         currency: 'eur',
//         product_data: {
//           name: item.name,
//         },
//         unit_amount: parseFloat(item.price.toString()) * 100,
//       },
//       quantity: item.quantity,
//     }));

//     const url = new URL(process.env.APP_URL);
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items,
//       mode: 'payment',
//       success_url: url.toString(),
//       cancel_url: 'http://localhost:3000/cancel',
//       shipping_address_collection: {
//         allowed_countries: ['US', 'BR','FR'],
//       },
//     });

//     res.json({ id: session.id });
//   } catch (error) {
//     console.error('createPayment error:', error);
//     return next(error);
//   }
// };

// const completePayment = async (req, res, next) => {
//   try {
//     const sessionId = req.query.session_id;

//     const [session, lineItems] = await Promise.all([
//       stripe.checkout.sessions.retrieve(sessionId, { expand: ['payment_intent.payment_method'] }),
//       stripe.checkout.sessions.listLineItems(sessionId),
//     ]);

//     console.log(JSON.stringify({ session, lineItems }));
//     const url =  new URL('/complete', process.env.APP_URL).toString();
//     res.redirect(url);
//   } catch (error) {
//     console.error('completePayment error:', error);
//     next(error);
//   }
// };


// module.exports = { createPayment, completePayment};
