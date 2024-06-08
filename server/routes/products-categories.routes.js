import { Router } from 'express';
import {
  createProductCategory,
  getProductCategories,
  getProductCategory,
  updateProductCategory,
  deleteProductCategory,
} from '../controllers/products-categories.controller.js';
import productsRouter from './products.routes.js';
import validator from 'validator';

const productsCategoriesRouter = Router();
productsCategoriesRouter.param('category', (req, res, next, category) => {
  if (!validator.isUUID(category) && !validator.isSlug(category)) {
    return res.status(400).json({
      message: 'Catégorie non valide',
    });
  }
  return next();
});

productsCategoriesRouter.use('/:category/products', productsRouter);

productsCategoriesRouter
  .route('/:category')
  .get(getProductCategory)
  .patch(updateProductCategory)
  .delete(deleteProductCategory);

productsCategoriesRouter
  .route('/')
  .get(getProductCategories)
  .post(createProductCategory);

export default productsCategoriesRouter;
