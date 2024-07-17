const { Router } = require('express');
const {
  createUser,
  getUsers,
  replaceUser,
  deleteUser,
  updateUser,
  getUser,
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
usersRouter.get('/users/:userId', getUser);

usersRouter.put(
  '/users/:userId',
  checkAuth(authConfig.accessTokenSecret, true),
  isOwnAccount,
  replaceUser,
);

usersRouter.patch(
  '/users/:userId',
  checkAuth(authConfig.accessTokenSecret, true),
  isOwnAccount,
  updateUser,
);

usersRouter.delete(
  '/users/:userId',
  checkAuth(authConfig.accessTokenSecret, true),
  checkRole(['admin']),
  deleteUser,
);

module.exports = usersRouter;
