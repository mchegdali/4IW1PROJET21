const { Router } = require('express');
const {
  createOrder,
  deleteOrder,
  getOrder,
  getOrders,
  updateOrder,
} = require('../controllers/order.controller');

const orderRouter = Router();

orderRouter
  .route('/orders/:id')
  .get(getOrder)
  .patch(updateOrder)
  .delete(deleteOrder);

orderRouter.route('/orders').get(getOrders).post(createOrder);

module.exports = orderRouter;
