const { Router } = require('express');
const {
  createUser,
  getUsers,
  replaceUser,
  deleteUser,
  updateUser,
  getUserCount,
} = require('../controllers/users.controller');
const { checkAuth, checkRole } = require('../middlewares/auth.middleware');
const authConfig = require('../config/auth.config');
const { isOwnAccount } = require('../middlewares/users.middleware');
const addressesRouter = require('./addresses.routes');
const userBasketRouter = require('./basket.routes');
const { userOrderRouter } = require('./order.routes');

const usersRouter = Router();

// Route pour créer un utilisateur
usersRouter.post(
  '/users',
  checkAuth(authConfig.accessTokenSecret, true),
  createUser,
);

// Route pour obtenir tous les utilisateurs
usersRouter.get(
  '/users',
  checkAuth(authConfig.accessTokenSecret, false),
  checkRole(['admin']),
  getUsers,
);

// Route pour obtenir le nombre total d'utilisateurs
usersRouter.get(
  '/users/count',
  // checkAuth(authConfig.accessTokenSecret, false),
  // checkRole(['admin']),
  getUserCount,
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

// Route pour supprimer un utilisateur
usersRouter.delete(
  '/users/:id',
  checkAuth(authConfig.accessTokenSecret, true),
  checkRole(['admin']),
  deleteUser,
);

module.exports = usersRouter;