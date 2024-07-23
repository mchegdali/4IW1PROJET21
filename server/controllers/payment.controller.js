const httpErrors = require('http-errors');
const sequelize = require('../models/sql');
const { paymentCreateSchema } = require('../schemas/payments.schema');
const { NotFound } = httpErrors;
const Payments = sequelize.model('payments');
const OrdersMongo = require('../models/mongo/orders.mongo');
const UsersMongo = require('../models/mongo/user.mongo');
const PaymentsMongo = require('../models/mongo/payment.mongo');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPayment = async (req, res, next) => {
  try {
    const paymentCreateBody = await paymentCreateSchema.parseAsync(req.body);

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

    // Create line items from order items
    const line_items = order.items.map((item) => ({
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
      customer_email: req.user.email, // Pre-fill the customer's email
      line_items,
      mode: 'payment',
      success_url: `${url.toString()}payment/confirmation`,
      cancel_url: `${url.toString()}/cancel`,
      shipping_address_collection: {
        allowed_countries: ['US', 'BR', 'FR'],
      },
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

const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_SECRET_KEY;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const email = paymentIntent.receipt_email; // contains the email that will receive the receipt for the payment (user's email usually)
        console.log(`PaymentIntent was successful for ${email}!`);

        // Ici, vous pouvez ajouter la logique pour mettre à jour votre base de données
        // Par exemple, marquer une commande comme payée, envoyer un email de confirmation, etc.
        await handleSuccessfulPayment(paymentIntent);

        break;
      }
      // Vous pouvez ajouter d'autres cas pour gérer différents types d'événements
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Error processing webhook');
  }
};

const handleSuccessfulPayment = async (paymentIntent) => {
  //si le payement est un succès createPayment en bdd
  console.log('Handling successful payment:', paymentIntent.id);
  // Ajoutez votre logique ici
};
module.exports = {
  createPayment,
  createStripeSession,
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
