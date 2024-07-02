const { Router } = require('express');
const {
  login,
  confirm,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth.controller');
const { checkAuth } = require('../middlewares/auth.middleware');
const authConfig = require('../config/auth.config');

const authRouter = Router();

authRouter.post('/auth/login', login);
// authRouter.post('/register', register);
authRouter.post(
  '/auth/confirm',
  checkAuth(authConfig.accessTokenSecret, false),
  confirm,
);
authRouter.post('/auth/forgot-password', forgotPassword);
authRouter.post(
  '/auth/reset-password',
  checkAuth(authConfig.forgotPasswordTokenSecret, false),
  resetPassword,
);

module.exports = authRouter;
