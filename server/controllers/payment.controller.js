const paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: 'sandbox', // Sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET,
});

const createPayment = (req, res) => {
  const create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      return_url: 'http://localhost:3000/success',
      cancel_url:  'http://localhost:3000/cancel',
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": "Node.js Complete Course",
          "sku": "001",
          "price": "300.00",
          "currency": "USD",
          "quantity": 1
        }]
      },
      "amount": {
        "currency": "USD",
        "total": "300.00"
      },
      "description": "Node.js Complete Course"
    }]
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          res.json({ redirectUrl: payment.links[i].href });
        }
      }
    }
  });
};

const executePayment = (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
      "amount": {
        "currency": "USD",
        "total": "100.00"
      }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
      console.log(error.response);
      throw error;
    } else {
      res.json({ message: 'Payment successful', payment });
    }
  });
};
module.exports = {createPayment,executePayment}