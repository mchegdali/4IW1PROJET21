const express = require('express');
const paymentRouter = express.Router();
const {
  createPayment,
  handleStripeWebhook,
  createStripeSession,
} = require('../controllers/payment.controller');
const { checkAuth, checkRole } = require('../middlewares/auth.middleware');
const authConfig = require('../config/auth.config');

paymentRouter.post(
  '/payment',
  checkAuth(authConfig.accessTokenSecret),
  createPayment,
);

paymentRouter.post(
  '/stripe',
  checkAuth(authConfig.accessTokenSecret),
  createStripeSession,
);

paymentRouter.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook,
);

module.exports = paymentRouter;
