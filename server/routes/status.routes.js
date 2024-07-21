const { Router } = require('express');
const {
  createStatus,
  getStatuses,
  replaceStatus,
  deleteStatus,
  updateStatus,
} = require('../controllers/status.controller');
const { checkAuth, checkRole } = require('../middlewares/auth.middleware');
const authConfig = require('../config/auth.config');

const statusRouter = Router();

// Route pour créer un status
statusRouter.post(
  '/status',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['admin']),
  createStatus,
);

// Route pour obtenir tous les statuts
statusRouter.get(
  '/status',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['admin']),
  getStatuses,
);

statusRouter.get('/status/:id', getStatuses);

statusRouter.put(
  '/status/:id',
  checkAuth(authConfig.accessTokenSecret),
  replaceStatus,
);

statusRouter.patch(
  '/status/:id',
  checkAuth(authConfig.accessTokenSecret),
  updateStatus,
);

// Route pour supprimer un status
statusRouter.delete(
  '/status/:id',
  checkAuth(authConfig.accessTokenSecret),
  checkRole(['admin']),
  deleteStatus,
);

module.exports = statusRouter;
