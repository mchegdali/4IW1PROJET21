const { Router } = require('express');
const {
  createCategory,
  deleteCategory,
  getCategory,
  getCategories,
  updateCategory,
  getCategoryCount,
} = require('../controllers/categories.controller');
const isUUIDOrSlug = require('../utils/is-uuid-or-slug');
const { getProducts } = require('../controllers/products.controller');
const { checkAuth, checkRole } = require('../middlewares/auth.middleware');
const authConfig = require('../config/auth.config');

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

categoriesRouter.get(
  '/categories/count',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['admin']),
  getCategoryCount,
);

categoriesRouter.get('/categories/:category/products', getProducts);

categoriesRouter
  .route('/categories/:category')
  .all(checkAuth(authConfig.accessTokenSecret), checkRole(['admin']))
  .get(getCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

categoriesRouter
  .route('/categories')
  .get(getCategories)
  .post(
    checkAuth(authConfig.accessTokenSecret),
    checkRole(['admin']),
    createCategory,
  );

module.exports = categoriesRouter;
