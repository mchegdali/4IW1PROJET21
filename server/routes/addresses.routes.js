const { Router } = require('express');
const {
  createAddress,
  deleteAddress,
  updateAddress,
  getAddresses,
  getAddress,
  replaceAddress,
} = require('../controllers/addresses.controller');
const { checkAuth, checkRole } = require('../middlewares/auth.middleware');
const authConfig = require('../config/auth.config');
const { isOwnAccount } = require('../middlewares/user.middleware');

const addressesRouter = Router({mergeParams: true});

addressesRouter.post(
  '/',
  checkAuth(authConfig.accessTokenSecret, true),
  createAddress,
);

addressesRouter.patch(
  '/:id',
  // checkAuth(authConfig.accessTokenSecret, true),
  // isOwnAccount,
  updateAddress,
);

addressesRouter.put(
  '/:id',
  // checkAuth(authConfig.accessTokenSecret, true),
  // isOwnAccount,
  replaceAddress,
);

addressesRouter.delete(
  '/:id',
  (req, res, next) => {
    console.log(req.params);
    next()
  },
  checkAuth(authConfig.accessTokenSecret, true),
  checkRole(['admin']),
  deleteAddress,
);

addressesRouter.get('/', getAddresses);
addressesRouter.get('/:id', getAddress);

module.exports = addressesRouter;
