const { Router } = require('express');
const {
  createUser,
  getUsers,
  replaceUser,
  deleteUser,
  updateUser,
  getUser,
  getUserCount,
  getUserRegistrations
} = require('../controllers/users.controller');
const { checkAuth, checkRole } = require('../middlewares/auth.middleware');
const authConfig = require('../config/auth.config');
const { isOwnAccount } = require('../middlewares/user.middleware');
const addressesRouter = require('./addresses.routes');

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
  checkAuth(authConfig.accessTokenSecret, false),
  checkRole(['admin']),
  getUserCount,
);

// Route pour obtenir le nombre d'inscriptions d'utilisateurs par jour
usersRouter.get(
  '/users/registrations',
  checkAuth(authConfig.accessTokenSecret, false),
  checkRole(['admin']),
  getUserRegistrations,
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

// Route pour supprimer un utilisateur
usersRouter.delete(
  '/users/:userId',
  checkAuth(authConfig.accessTokenSecret, true),
  checkRole(['admin']),
  deleteUser,
);

module.exports = usersRouter;
