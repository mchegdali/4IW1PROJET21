const { Router } = require('express');
const {
  createShipping,
  getShipping,
} = require('../controllers/shipping.controller');

const shippingRouter = Router();
shippingRouter.route('/shipping/:id').get(getShipping);
shippingRouter.post('/shipping', createShipping);


module.exports = shippingRouter;
