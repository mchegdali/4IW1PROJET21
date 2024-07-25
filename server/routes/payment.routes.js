const express = require('express');
const paymentRouter = express.Router();
const {
  createPayment,
  getPayment,
  getPayments,
  updatePayment,
  createStripeSession,
  handleStripeWebhook,
} = require('../controllers/payment.controller');
const { checkAuth, checkRole } = require('../middlewares/auth.middleware');
const authConfig = require('../config/auth.config');

paymentRouter
  .route('/payment/:id')
  .get(checkAuth(authConfig.accessTokenSecret), getPayment)
  .patch(
    checkAuth(authConfig.accessTokenSecret),
    checkRole(['admin']),
    checkRole(['accountant']),
    updatePayment,
  );

paymentRouter.post(
  '/payment',
  checkAuth(authConfig.accessTokenSecret),
  createPayment,
);

paymentRouter.post(
  '/stripe',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['admin']),
  checkRole(['accountant']),
  createStripeSession,
);

paymentRouter.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['admin']),
  checkRole(['accountant']),
  handleStripeWebhook,
);

module.exports = paymentRouter;
