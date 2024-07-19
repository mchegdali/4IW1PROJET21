const { Router } = require('express');
const {
  createOrder,
  deleteOrder,
  getOrder,
  getOrders,
  updateOrder,
  getOrderCount,
} = require('../controllers/order.controller');
const { checkAuth, checkRole } = require('../middlewares/auth.middleware');
const authConfig = require('../config/auth.config');

const orderRouter = Router();

orderRouter.route('/orders').get(getOrders).post(createOrder);

orderRouter.get('/orders/count',
  checkAuth(authConfig.accessTokenSecret, false),
  checkRole(['admin']),
  getOrderCount
);

orderRouter
  .route('/orders/:id')
  .get(getOrder)
  .patch(updateOrder)
  .delete(deleteOrder);

module.exports = orderRouter;
