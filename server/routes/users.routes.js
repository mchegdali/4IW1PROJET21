const { Router } = require('express');
const {
  createUser,
  getUsers,
  replaceUser,
  deleteUser,
  updateUser,
  getUser,
  getUserAddresses,
} = require('../controllers/users.controller');
const { checkAuth, checkRole } = require('../middlewares/auth.middleware');
const authConfig = require('../config/auth.config');
const { isOwnAccount } = require('../middlewares/user.middleware');
const addressesRouter = require('./addresses.routes');

const usersRouter = Router();

usersRouter.post(
  '/users',
  checkAuth(authConfig.accessTokenSecret, true),
  createUser,
);

usersRouter.get(
  '/users',
  checkAuth(authConfig.accessTokenSecret, false),
  checkRole(['admin']),
  getUsers,
);

usersRouter.use('/users/:userId/addresses', addressesRouter);
usersRouter.get('/users/:id', getUser);

usersRouter.put(
  '/users/:id',
  checkAuth(authConfig.accessTokenSecret, true),
  isOwnAccount,
  replaceUser,
);

usersRouter.patch(
  '/users/:id',
  checkAuth(authConfig.accessTokenSecret, true),
  isOwnAccount,
  updateUser,
);

usersRouter.delete(
  '/users/:id',
  checkAuth(authConfig.accessTokenSecret, true),
  checkRole(['admin']),
  deleteUser,
);

module.exports = usersRouter;
