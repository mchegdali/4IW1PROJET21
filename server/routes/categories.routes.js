const { Router } = require('express');
const {
  createCategory,
  deleteCategory,
  getCategory,
  getCategories,
  updateCategory,
} = require('../controllers/categories.controller');
const isUUIDOrSlug = require('../utils/is-uuid-or-slug');
const { getProducts } = require('../controllers/products.controller');

const categoriesRouter = Router();

categoriesRouter.param('category', (req, res, next, category) => {
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

categoriesRouter.get('/categories/:category/products', getProducts);

categoriesRouter
  .route('/categories/:category')
  .get(getCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

categoriesRouter.route('/categories').get(getCategories).post(createCategory);

module.exports = categoriesRouter;
