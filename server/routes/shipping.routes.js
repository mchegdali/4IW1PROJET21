const { Router } = require('express');
const {
  createShipping,
  getShipping,
  updateShipping,
} = require('../controllers/shipping.controller');

const shippingRouter = Router();
shippingRouter
  .route('/shipping/:id')
  .get(getShipping)
  .patch(updateShipping);
  // .delete(deleteShipping);
shippingRouter.post('/shipping', createShipping);


module.exports = shippingRouter;
