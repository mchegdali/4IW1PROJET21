const { Router } = require('express');
const {
  createUser,
  getUsers,
  replaceUser,
  deleteUser,
  updateUser,
  getUser,
  getUserCount,
  getUserRegistrations,
  getUserRegistrationsLast12Months,
} = require('../controllers/users.controller');
const { checkAuth, checkRole } = require('../middlewares/auth.middleware');
const authConfig = require('../config/auth.config');
const { isOwnAccount } = require('../middlewares/user.middleware');
const addressesRouter = require('./addresses.routes');
const userBasketRouter = require('./basket.routes');
const { userOrderRouter } = require('./order.routes');

const usersRouter = Router();

// Route pour obtenir le nombre total d'utilisateurs
usersRouter.get(
  '/users/count',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['admin']),
  getUserCount,
);

// Obtient le nombre d'inscriptions des 12 derniers mois
usersRouter.get(
  '/users/registrations-last-12-months',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['admin']),
  getUserRegistrationsLast12Months,
);

// Route pour obtenir le nombre d'inscriptions d'utilisateurs par jour
usersRouter.get(
  '/users/registrations',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['admin']),
  getUserRegistrations,
);

usersRouter.use(
  '/users/:userId/addresses',
  checkAuth(authConfig.accessTokenSecret),
  isOwnAccount,
  addressesRouter,
);

usersRouter.use(
  '/users/:userId/orders',
  checkAuth(authConfig.accessTokenSecret),
  isOwnAccount,
  userOrderRouter,
);

usersRouter.use(
  '/users/:userId/basket',
  checkAuth(authConfig.accessTokenSecret),
  isOwnAccount,
  userBasketRouter,
);

usersRouter.get(
  '/users/:userId',
  checkAuth(authConfig.accessTokenSecret),
  isOwnAccount,
  getUser,
);

usersRouter.put(
  '/users/:userId',
  checkAuth(authConfig.accessTokenSecret),
  isOwnAccount,
  replaceUser,
);

usersRouter.patch(
  '/users/:userId',
  checkAuth(authConfig.accessTokenSecret),
  isOwnAccount,
  updateUser,
);

// Route pour supprimer un utilisateur
usersRouter.delete(
  '/users/:userId',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['admin']),
  deleteUser,
);

usersRouter.post('/users', checkAuth(authConfig.accessTokenSecret), createUser);

usersRouter.get(
  '/users',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['admin']),
  getUsers,
);

module.exports = usersRouter;
