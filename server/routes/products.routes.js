import { Router } from 'express';
import {
  createProduct,
  getProduct,
  getProducts,
} from '../controllers/products.controller.js';

const productsRouter = Router();

productsRouter.route('/:product').get(getProduct);
productsRouter.route('/').get(getProducts).post(createProduct);

export default productsRouter;
