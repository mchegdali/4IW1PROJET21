const { Router } = require('express');
const {
  createOrder,
  deleteOrder,
  getOrder,
  getOrders,
  updateOrder,
  getOrderCount,
  getTotalRevenue,
  getOrderStatusDistribution,
  getTotalSales,
  getDistinctCustomerCount,
  getUserOrders,
} = require('../controllers/order.controller');
const { checkAuth, checkRole } = require('../middlewares/auth.middleware');
const authConfig = require('../config/auth.config');

const orderRouter = Router();
const userOrderRouter = Router({ mergeParams: true });

orderRouter.route('/orders').get(getOrders).post(createOrder);

orderRouter.get(
  '/orders/count',
  checkAuth(authConfig.accessTokenSecret, false),
  checkRole(['admin']),
  getOrderCount,
);

orderRouter.get(
  '/orders/revenue',
  checkAuth(authConfig.accessTokenSecret, false),
  checkRole(['admin']),
  getTotalRevenue,
);

// Nombre total de ventes
orderRouter.get(
  '/orders/total-sales',
  checkAuth(authConfig.accessTokenSecret, false),
  checkRole(['admin']),
  getTotalSales,
);

//Nombre d'users distinct
orderRouter.get(
  '/orders/distinct-customers',
  checkAuth(authConfig.accessTokenSecret, false),
  checkRole(['admin']),
  getDistinctCustomerCount,
);

orderRouter.get(
  '/orders/status-distribution',
  checkAuth(authConfig.accessTokenSecret, false),
  checkRole(['admin']),
  getOrderStatusDistribution,
);

orderRouter
  .route('/orders/:id')
  .get(getOrder)
  .patch(updateOrder)
  .delete(deleteOrder);

userOrderRouter.get('/', getUserOrders);

module.exports = { orderRouter, userOrderRouter };
