const { Router } = require('express');
const {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
  getProductCount,
  getProductDistributionByCategory,
  getPriceDistribution,
} = require('../controllers/products.controller');
const { checkAuth, checkRole } = require('../middlewares/auth.middleware');
const authConfig = require('../config/auth.config');

const productsRouter = Router({ mergeParams: true });

productsRouter.get(
  '/products/count',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['admin']),
  getProductCount,
);

productsRouter.get(
  '/products/distribution-by-category',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['admin']),
  getProductDistributionByCategory,
  getProductDistributionByCategory,
);

productsRouter.get(
  '/products/price-distribution',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['admin']),
  getPriceDistribution,
);

productsRouter.get('/products/:product/related', getRelatedProducts);
productsRouter
  .route('/products/:product')
  .get(getProduct)
  .patch(updateProduct)
  .delete(deleteProduct);
productsRouter.route('/products').get(getProducts).post(createProduct);

module.exports = productsRouter;
