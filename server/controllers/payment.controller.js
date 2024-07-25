const httpErrors = require('http-errors');
const sequelize = require('../models/sql');
const {
  paymentCreateSchema,
  paymentQuerySchema,
  paymentUpdateSchema,
} = require('../schemas/payments.schema');
const { NotFound } = httpErrors;
const Payments = sequelize.model('payments');
const OrdersMongo = require('../models/mongo/orders.mongo');
const UsersMongo = require('../models/mongo/user.mongo');
const PaymentsMongo = require('../models/mongo/payment.mongo');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const createPayment = async (req, res, next) => {
  try {
    const user = await UsersMongo.findById(req.user._id);
    if (!user) {
      throw new NotFound('User not found');
    }
    console.log('first log', user);

    const result = await sequelize.transaction(async (t) => {
      const order = await OrdersMongo.findOne({ user: user })
        .sort({ createdAt: -1 })
        .exec();
      if (!order) {
        throw new NotFound('Order not found');
      }
      console.log('second log', order);

      if (!Array.isArray(order.items)) {
        throw new Error('Order items are not an array');
      }

      const totalPrice = order.items.reduce((total, item) => {
        return total + parseFloat(item.price.toString()) * (item.quantity || 1);
      }, 0);

      const payment = await Payments.create(
        {
          userId: user._id,
          orderId: order._id,
          paymentStatus: 'Pending',
          totalPrice: totalPrice.toFixed(2),
        },
        { transaction: t },
      );
      console.log('third log', payment);

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
      console.log('fourth log', paymentMongo);

      const paymentDoc = await PaymentsMongo.create(paymentMongo);
      return { paymentDoc, order };
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error('createPayment error:', error);
    return next(error);
  }
};
async function createStripeSession(req, res, next) {
  try {
    const stripeCreateBody = await paymentCreateSchema.parseAsync(req.body);
    console.log(stripeCreateBody);

    const order = await OrdersMongo.findById(stripeCreateBody.order);
    if (!order) {
      throw new Error('Order not found');
    }
    console.log('Order found', order);

    const line_items = order.items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(parseFloat(item.price) * 100) + 200,
      },
      quantity: item.quantity || 1,
    }));

    const url = new URL(process.env.APP_URL);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: req.user.email,
      line_items,
      mode: 'payment',
      success_url: `${url.toString()}payment/confirmation`,
      cancel_url: `${url.toString()}/cancel`,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    console.log(session);
    return res.json({ id: session.id });
  } catch (error) {
    return next(error);
  }
}

const handleStripeWebhook = async (paymentIntent) => {
  console.log('Handling successful payment:', paymentIntent.id);

  try {
    const session = await stripe.checkout.sessions.retrieve(
      paymentIntent.payment_intent,
    );
    const orderId = session.metadata.orderId;

    const order = await OrdersMongo.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const user = await UsersMongo.findById(order.user);
    if (!user) {
      throw new Error('User not found');
    }

    const totalPrice = order.items.reduce((total, item) => {
      return total + parseFloat(item.price.toString()) * (item.quantity || 1);
    }, 0);

    const result = await sequelize.transaction(async (t) => {
      const payment = await Payments.create(
        {
          userId: user._id,
          orderId: order._id,
          paymentStatus: 'Paid',
          totalPrice: totalPrice.toFixed(2),
          stripePaymentIntentId: paymentIntent.id,
        },
        { transaction: t },
      );

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
          quantity: item.quantity || 1,
        })),
        paymentStatus: 'Paid',
        totalPrice: totalPrice.toFixed(2),
        stripePaymentIntentId: paymentIntent.id,
      };

      const paymentDoc = await PaymentsMongo.create(paymentMongo);

      await OrdersMongo.findByIdAndUpdate(orderId, { status: 'Paid' });

      return { payment, paymentDoc };
    });

    console.log('Payment created successfully:', result);
  } catch (error) {
    console.error('Error creating payment:', error);

    try {
      const orderId =
        error.orderId ||
        (await stripe.checkout.sessions.retrieve(paymentIntent.payment_intent))
          .metadata.orderId;

      await OrdersMongo.findByIdAndUpdate(orderId, { status: 'Pending' });

      const pendingPayment = {
        userId: error.userId,
        orderId: orderId,
        paymentStatus: 'Pending',
        totalPrice: error.totalPrice || 0,
        stripePaymentIntentId: paymentIntent.id,
      };

      await Payments.create(pendingPayment);
      await PaymentsMongo.create(pendingPayment);

      console.log('Payment and order status set to Pending due to error');
    } catch (pendingError) {
      console.error(
        'Error setting payment and order to Pending:',
        pendingError,
      );
    }

    throw error;
  }
};
/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getPayment(req, res, next) {
  try {
    const id = req.params.id;

    const filter = {
      _id: id,
    };

    const payment = await PaymentsMongo.findOne(filter);

    if (!paymentQuerySchema) {
      return res.sendStatus(404);
    }
    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
}
async function getPayments(req, res, next) {
  try {
    const payments = await PaymentsMongo.find({}).lean({});
    return res.json(payments);
  } catch (error) {
    return next(error);
  }
}

async function updatePayment(req, res, next) {
  try {
    const updateData = await paymentUpdateSchema.parseAsync(req.body);
    const id = req.params.id;

    const result = await sequelize.transaction(async (t) => {
      const updatedPaymentMongo = await PaymentsMongo.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        },
      );

      if (!updatedPaymentMongo) {
        throw new NotFound();
      }

      const [updatedCount, updatedPayments] = await Payments.update(
        updateData,
        {
          where: { id },
          transaction: t,
          returning: true,
        },
      );

      if (updatedCount === 0) {
        throw new NotFound();
      }

      const combinedPayment = {
        ...updatedPaymentMongo.toObject(),
        ...updatedPayments[0].toJSON(),
      };

      return combinedPayment;
    });

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}
module.exports = {
  createPayment,
  getPayment,
  getPayments,
  updatePayment,
  createStripeSession,
  handleStripeWebhook,
};
