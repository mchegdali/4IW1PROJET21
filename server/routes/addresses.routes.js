const { Router } = require('express');
const {
  createAddress,
  deleteAddress,
  updateAddress,
  getAddresses,
  getAddress,
  replaceAddress,
} = require('../controllers/addresses.controller');
const { checkAuth } = require('../middlewares/auth.middleware');
const authConfig = require('../config/auth.config');
const { isOwnAccount } = require('../middlewares/user.middleware');

const addressesRouter = Router({ mergeParams: true });

addressesRouter.post(
  '/',
  checkAuth(authConfig.accessTokenSecret),
  isOwnAccount,
  createAddress,
);

addressesRouter.patch(
  '/:id',
  checkAuth(authConfig.accessTokenSecret),
  isOwnAccount,
  updateAddress,
);

addressesRouter.put(
  '/:id',
  checkAuth(authConfig.accessTokenSecret),
  isOwnAccount,
  replaceAddress,
);

addressesRouter.delete(
  '/:id',
  checkAuth(authConfig.accessTokenSecret),
  deleteAddress,
);

addressesRouter.get(
  '/',
  checkAuth(authConfig.accessTokenSecret),
  isOwnAccount,
  getAddresses,
);
addressesRouter.get(
  '/:id',
  checkAuth(authConfig.accessTokenSecret),
  isOwnAccount,
  getAddress,
);

module.exports = addressesRouter;
