const { Router } = require('express');
const { getAlerts, updateAlerts } = require('../controllers/alerts.controller');
const { checkAuth } = require('../middlewares/auth.middleware');
const authConfig = require('../config/auth.config');

const alertsRouter = Router({ mergeParams: true });

alertsRouter.get('/', checkAuth(authConfig.accessTokenSecret), getAlerts);

alertsRouter.patch('/', checkAuth(authConfig.accessTokenSecret), updateAlerts);

module.exports = alertsRouter;
