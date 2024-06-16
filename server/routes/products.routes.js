import { Router } from 'express';
import {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
} from '../controllers/products.controller.js';

const productsRouter = Router({ mergeParams: true });

productsRouter.get('/:product/related', getRelatedProducts);
productsRouter
  .route('/:product')
  .get(getProduct)
  .patch(updateProduct)
  .delete(deleteProduct);
productsRouter.route('/').get(getProducts).post(createProduct);

export default productsRouter;
