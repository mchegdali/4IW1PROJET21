import { Router } from 'express';
import {
  createProductCategory,
  getProductCategories,
  getProductCategory,
  updateProductCategory,
  deleteProductCategory,
} from '../controllers/products-categories.controller.js';
import isUUIDOrSlug from '../utils/is-uuid-or-slug.js';
import { getProducts } from '../controllers/products.controller.js';

const productsCategoriesRouter = Router();

productsCategoriesRouter.param('category', (req, res, next, category) => {
  const { isSlug, isUUID } = isUUIDOrSlug(category);
  if (!isUUID && !isSlug) {
    return res.status(422).json({
      message: 'Catégorie non valide',
    });
  }

  res.locals.category = {
    isSlug,
    isUUID,
  };
  return next();
});

productsCategoriesRouter.get('/:category/products', getProducts);

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
