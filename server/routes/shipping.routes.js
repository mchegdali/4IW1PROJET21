const { Router } = require('express');
const {
  createShipping,
  getAllShipping,
  getShipping,
} = require('../controllers/shipping.controller');

const shippingRouter = Router();
shippingRouter.route('/shipping/:id').get(getShipping);
shippingRouter.get('/shipping', getAllShipping);
shippingRouter.post('/shipping', createShipping);

module.exports = shippingRouter;
