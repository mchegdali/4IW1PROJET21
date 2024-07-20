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
  getTotalSales
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

orderRouter.get('/orders/revenue',
  checkAuth(authConfig.accessTokenSecret, false),
  checkRole(['admin']),
  getTotalRevenue
);

// Nombre total de ventes
orderRouter.get(
  '/orders/total-sales',
  checkAuth(authConfig.accessTokenSecret, false),
  checkRole(['admin']),
  getTotalSales
);

orderRouter.get('/orders/status-distribution',
  checkAuth(authConfig.accessTokenSecret, false),
  checkRole(['admin']),
  getOrderStatusDistribution
);

orderRouter
  .route('/orders/:id')
  .get(getOrder)
  .patch(updateOrder)
  .delete(deleteOrder);

module.exports = orderRouter;
