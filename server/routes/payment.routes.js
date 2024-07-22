const express = require('express');
const router = express.Router();
const {
  createPayment,
  handleStripeWebhook,
  createStripeSession,
} = require('../controllers/payment.controller');
const { checkAuth, checkRole } = require('../middlewares/auth.middleware');
const authConfig = require('../config/auth.config');

router.post('/payment', checkAuth(authConfig.accessTokenSecret), createPayment);
router.post(
  '/stripe',
  checkAuth(authConfig.accessTokenSecret),
  createStripeSession,
);

router.post('/webhook', handleStripeWebhook);

module.exports = router;
