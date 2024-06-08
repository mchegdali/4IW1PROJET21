import { Router } from 'express';
import {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from '../controllers/products.controller.js';

const productsRouter = Router({ mergeParams: true });

productsRouter
  .route('/:product')
  .get(getProduct)
  .patch(updateProduct)
  .delete(deleteProduct);
productsRouter.route('/').get(getProducts).post(createProduct);

export default productsRouter;
