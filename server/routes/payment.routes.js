const { Router } = require('express');
const {
  createPayment,
  executePayment,
} = require('../controllers/payment.controller');

const paymentRouter = Router();

paymentRouter.post('/payment', createPayment);
paymentRouter.get('/payment/:id/success', executePayment);
paymentRouter.get('/cancel', (req, res) => res.send('Cancelled'));

module.exports = paymentRouter;
