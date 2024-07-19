const stripe = require('stripe')('sk_test_51PeDeeId99a4h4TCtZHFvfkpMCxcomJbjMa4RydO0hrpOaU9iJRyXXfNbj9ZOipRemzUtCoyUhPRIY0SAsmACML30075O7ZqDl')
const httpErrors = require('http-errors');
const OrdersMongo = require('../models/mongo/orders.mongo');
const UsersMongo = require('../models/mongo/user.mongo');
const PaymentsMongo = require('../models/mongo/payment.mongo');
const sequelize = require('../models/sql');
const { NotFound } = httpErrors;
const Payments = sequelize.model("payments");

const { paymentQuerySchema, paymentCreateSchema, paymentUpdateSchema} = require('../schemas/payments.schema');

const createPayment = async (req, res, next) => {
  try {
    // Parse request body
    const paymentCreateBody = await paymentCreateSchema.parseAsync(req.body);

    // Find the user
    const user = await UsersMongo.findById(paymentCreateBody.user);
    if (!user) {
      throw new NotFound('User not found');
    }
    console.log("first log", user);

    // Transaction to ensure atomic operations
    const result = await sequelize.transaction(async (t) => {
      // Find the latest order for the user
      const order = await OrdersMongo.findOne({ user: user }).sort({ createdAt: -1 }).exec();
      if (!order) {
        throw new NotFound('Order not found');
      }
      console.log("second log", order);

      // Ensure order.items is an array
      if (!Array.isArray(order.items)) {
        throw new Error('Order items are not an array');
      }

      // Calculate total price
      const totalPrice = order.items.reduce((total, item) => {
        return total + parseFloat(item.price.toString());
      }, 0);

      // Create payment record in SQL
      const payment = await Payments.create({
        userId: user._id,
        orderId: order._id,
        paymentStatus: 'Pending',
        totalPrice: totalPrice.toFixed(2),
      }, { transaction: t });
      console.log("third log", payment);

      // Create payment document for MongoDB
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
      console.log("fourth log", paymentMongo);

      // Save payment document in MongoDB
      const paymentDoc = await PaymentsMongo.create(paymentMongo);
      return { paymentDoc, order };
    });

    // Extract payment document and order
    const { paymentDoc, order } = result;

    // Map line items for Stripe
    const line_items = order.items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: parseFloat(item.price.toString()) * 100, // Convert to cents
      },
      quantity: 1,
    }));

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'http://localhost:3000/complete?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/cancel',
      shipping_address_collection: {
        allowed_countries: ['US', 'BR'],
      },
    });

    // Redirect to Stripe Checkout
    res.redirect(303, session.url);
  } catch (error) {
    console.error('createPayment error:', error);
    return next(error);
  }
};
const completePayment = async (req, res, next) => {
  try {
    const sessionId = req.query.session_id;

    const [session, lineItems] = await Promise.all([
      stripe.checkout.sessions.retrieve(sessionId, { expand: ['payment_intent.payment_method'] }),
      stripe.checkout.sessions.listLineItems(sessionId),
    ]);

    console.log(JSON.stringify({ session, lineItems }));

    res.send('Your payment was successful');
  } catch (error) {
    console.error('completePayment error:', error);
    next(error);
  }
};


module.exports = { createPayment, completePayment};
