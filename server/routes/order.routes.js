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
  getMonthlyOrderCount,
} = require('../controllers/order.controller');
const { checkAuth, checkRole } = require('../middlewares/auth.middleware');
const authConfig = require('../config/auth.config');
const { isOwnOrder } = require('../middlewares/order.middleware');

const orderRouter = Router();
const userOrderRouter = Router({ mergeParams: true });

orderRouter.get(
  '/orders/count',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['admin']),
  getOrderCount,
);

orderRouter.get(
  '/orders/monthly-count',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['accountant']),
  getMonthlyOrderCount,
);

orderRouter.get(
  '/orders/revenue',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['admin']),
  getTotalRevenue,
);

// Nombre total de ventes
orderRouter.get(
  '/orders/total-sales',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['accountant']),
  getTotalSales,
);

//Nombre d'users distinct
orderRouter.get(
  '/orders/distinct-customers',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['accountant']),
  getDistinctCustomerCount,
);

orderRouter.get(
  '/orders/status-distribution',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['admin']),
  getOrderStatusDistribution,
);

orderRouter
  .route('/orders/:id')
  .get(checkAuth(authConfig.accessTokenSecret), isOwnOrder, getOrder)
  .patch(checkAuth(authConfig.accessTokenSecret), isOwnOrder, updateOrder)
  .delete(checkAuth(authConfig.accessTokenSecret), isOwnOrder, deleteOrder);

orderRouter.get(
  '/orders',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['admin', 'accountant']),
  getOrders,
);

orderRouter.post(
  '/orders',
  checkAuth(authConfig.accessTokenSecret),
  createOrder,
);

userOrderRouter.get('/', getUserOrders);

module.exports = { orderRouter, userOrderRouter };
