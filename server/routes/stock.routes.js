const { Router } = require('express');
const { checkAuth, checkRole } = require('../middlewares/auth.middleware');
const stockItemsController = require('../controllers/stock.controller');

const stockRouter = Router();

stockRouter.use(checkAuth(process.env.ACCESS_TOKEN_SECRET));

stockRouter.get(
  '/:stockItemId',
  checkRole(['stock_keeper', 'admin']),
  stockItemsController.getStockItem,
);

stockRouter.put(
  '/:stockItemId',
  checkRole(['stock_keeper', 'admin']),
  stockItemsController.updateStockItem,
);

stockRouter.delete(
  '/:stockItemId',
  checkRole(['admin']),
  stockItemsController.deleteStockItem,
);

stockRouter.get(
  '/count',
  checkRole(['stock_keeper', 'admin']),
  stockItemsController.getStockItemCount,
);

stockRouter.get(
  '/distribution/product',
  checkRole(['stock_keeper', 'admin']),
  stockItemsController.getStockItemDistributionByProduct,
);

stockRouter.post(
  '/',
  checkRole(['stock_keeper', 'admin']),
  stockItemsController.createStockItem,
);

stockRouter.get(
  '/',
  checkRole(['stock_keeper', 'admin']),
  stockItemsController.getStockItems,
);

module.exports = stockRouter;
