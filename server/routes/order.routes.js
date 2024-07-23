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

// orderRouter.use(
//   '/orders',
//   checkAuth(authConfig.accessTokenSecret, false),
// );

orderRouter.get(
  '/orders/count',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['admin']),
  getOrderCount,
);

orderRouter.get(
  '/orders/monthly-count',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['admin']),
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
  checkRole(['admin']),
  getTotalSales,
);

//Nombre d'users distinct
orderRouter.get(
  '/orders/distinct-customers',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['admin']),
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
  .all(checkAuth(authConfig.accessTokenSecret), isOwnOrder)
  .get(getOrder)
  .patch(updateOrder)
  .delete(deleteOrder);

orderRouter
  .route('/orders')
  .get(
    checkAuth(authConfig.accessTokenSecret),
    checkRole(['admin', 'accountant']),
    getOrders,
  )
  .post(checkAuth(authConfig.accessTokenSecret), createOrder);

userOrderRouter.get('/', getUserOrders);

module.exports = { orderRouter, userOrderRouter };
