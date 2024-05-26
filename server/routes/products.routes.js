import { Router } from 'express';
import productsController from '../controllers/products.controller.js';

const productsRouter = Router();

productsRouter.get('/', productsController.getProducts);
productsRouter.get('/:productId', productsController.getProductById);

export default productsRouter;
