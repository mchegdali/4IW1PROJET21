const { Router } = require('express');
const {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
} = require('../controllers/products.controller');

const productsRouter = Router({ mergeParams: true });

productsRouter.get('/products/:product/related', getRelatedProducts);
productsRouter
  .route('/products/:product')
  .get(getProduct)
  .patch(updateProduct)
  .delete(deleteProduct);
productsRouter.route('/products').get(getProducts).post(createProduct);

module.exports = productsRouter;
