const { Router } = require('express');
const {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
  getProductCount,
} = require('../controllers/products.controller');
const { checkAuth, checkRole } = require('../middlewares/auth.middleware');
const authConfig = require('../config/auth.config');

const productsRouter = Router({ mergeParams: true });

productsRouter.get(
  '/products/count',
  getProductCount,
);


productsRouter.get('/products/:product/related', getRelatedProducts);
productsRouter
  .route('/products/:product')
  .get(getProduct)
  .patch(updateProduct)
  .delete(deleteProduct);
productsRouter.route('/products').get(getProducts).post(createProduct);

module.exports = productsRouter;
