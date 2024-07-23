const { Router } = require('express');
const {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
  getProductCount,
  getProductDistributionByCategory,
  getPriceDistribution,
  getRecentProducts,
} = require('../controllers/products.controller');
const { checkAuth, checkRole } = require('../middlewares/auth.middleware');
const authConfig = require('../config/auth.config');
const upload = require('../config/multerConfig');

const productsRouter = Router({ mergeParams: true });

productsRouter.get(
  '/products/count',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['admin']),
  getProductCount,
);

productsRouter.get(
  '/products/distribution-by-category',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['admin']),
  getProductDistributionByCategory,
  getProductDistributionByCategory,
);

productsRouter.get(
  '/products/price-distribution',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['admin']),
  getPriceDistribution,
);

productsRouter.get('/products/:product/related', getRelatedProducts);
productsRouter.get('/products/recent', getRecentProducts);
productsRouter
  .route('/products/:product')
  .get(getProduct)
  .patch(
    checkAuth(authConfig.accessTokenSecret),
    checkRole(['admin']),
    upload.single('image'), // Utilisation de Multer pour gérer l'upload d'une image
    updateProduct
  )
  .delete(
    checkAuth(authConfig.accessTokenSecret),
    checkRole(['admin']),
    deleteProduct
  );

  productsRouter.route('/products')
  .get(getProducts)
  .post(
    checkAuth(authConfig.accessTokenSecret),
    checkRole(['admin']),
    upload.single('image'), // Utilisation de Multer pour gérer l'upload d'une image
    createProduct
  );


module.exports = productsRouter;
