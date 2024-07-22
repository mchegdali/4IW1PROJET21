// const { Router } = require('express');
// const {
//   createPayment,
//   completePayment,
// } = require('../controllers/payment.controller');

// const paymentRouter = Router();

// paymentRouter.post('/payment', createPayment);

// paymentRouter.get('/complete', completePayment);

// module.exports = paymentRouter;
// Dans votre fichier de routes (par exemple, routes/payment.routes.js)

const express = require('express');
const router = express.Router();
const { createPayment, handleStripeWebhook } = require('../controllers/payment.controller');

// Route pour créer un paiement
router.post('/payment', createPayment);

// Route pour le webhook Stripe
router.post('/webhook', express.raw({type: 'application/json'}), handleStripeWebhook);

module.exports = router;