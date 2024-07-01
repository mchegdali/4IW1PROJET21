const { Router } = require('express');
const {
  createUser,
  getUsers,
  replaceUser,
  deleteUser,
  updateUser,
} = require('../controllers/users.controller');
const { checkAuth, checkRole } = require('../middlewares/auth.middleware');
const authConfig = require('../config/auth.config');
const { isOwnAccount } = require('../middlewares/user.middleware');

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
