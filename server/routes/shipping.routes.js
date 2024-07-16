const { Router } = require('express');
const {
  createShipping,
  getShipping,
  updateShipping,
  deleteShipping,
  getShippings,
} = require('../controllers/shipping.controller');

const shippingRouter = Router();
shippingRouter
  .route('/shippings/:id')
  .get(getShipping)
  .patch(updateShipping)
  .delete(deleteShipping);
shippingRouter.route('/shippings').get(getShippings).post(createShipping);


module.exports = shippingRouter;
