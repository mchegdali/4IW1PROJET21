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
const { isOwnAccount } = require('../middlewares/users.middleware');

const addressesRouter = Router({ mergeParams: true });

addressesRouter.post(
  '/',
  checkAuth(authConfig.accessTokenSecret, true),
  isOwnAccount,
  createAddress,
);

addressesRouter.patch(
  '/:id',
  checkAuth(authConfig.accessTokenSecret, true),
  isOwnAccount,
  updateAddress,
);

addressesRouter.put(
  '/:id',
  checkAuth(authConfig.accessTokenSecret, true),
  isOwnAccount,
  replaceAddress,
);

addressesRouter.delete(
  '/:id',
  checkAuth(authConfig.accessTokenSecret, true),
  deleteAddress,
);

addressesRouter.get(
  '/',
  checkAuth(authConfig.accessTokenSecret, true),
  isOwnAccount,
  getAddresses,
);
addressesRouter.get(
  '/:id',
  checkAuth(authConfig.accessTokenSecret, true),
  isOwnAccount,
  getAddress,
);

module.exports = addressesRouter;
