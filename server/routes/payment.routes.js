const { Router } = require('express');
const {
  createPayment,
  completePayment,
} = require('../controllers/payment.controller');

const paymentRouter = Router();

paymentRouter.post('/payment', createPayment);

paymentRouter.get('/complete', completePayment);

module.exports = paymentRouter;
