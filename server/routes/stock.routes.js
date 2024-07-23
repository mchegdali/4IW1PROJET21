const { Router } = require('express');
const { checkAuth, checkRole } = require('../middlewares/auth.middleware');
const stockItemsController = require('../controllers/stock.controller');
const authConfig = require('../config/auth.config');

const stockRouter = Router();

stockRouter.use(
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['stock_keeper', 'admin']),
);

stockRouter.get('/stock/:stockItemId', stockItemsController.getStockItem);

stockRouter.patch('/stock/:stockItemId', stockItemsController.updateStockItem);

stockRouter.delete('/stock/:stockItemId', stockItemsController.deleteStockItem);

stockRouter.get(
  '/stock/distribution/product',
  stockItemsController.getStockItemDistributionByProduct,
);

stockRouter.post('/stock', stockItemsController.createStockItem);

stockRouter.get('/stock', stockItemsController.getStockItems);

module.exports = stockRouter;
