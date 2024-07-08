const { Router } = require('express');
const { createPayment, executePayment } = require('../controllers/payment.controller');

const paymentRouter = Router();

paymentRouter.post('/pay', createPayment);
paymentRouter.get('/success', executePayment);
paymentRouter.get('/cancel', (req, res) => res.send('Cancelled'));

module.exports = paymentRouter;
