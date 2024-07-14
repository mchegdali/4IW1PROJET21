const { Router } = require('express');
const {
  login,
  refreshToken,
  confirm,
  forgotPassword,
  resetPassword,
  resendConfirmationEmail,
} = require('../controllers/auth.controller');
const { checkAuth } = require('../middlewares/auth.middleware');
const authConfig = require('../config/auth.config');

const authRouter = Router();

authRouter.post('/auth/login', login);
authRouter.post('/auth/refresh-token', refreshToken);
authRouter.post('/auth/confirm', confirm);
authRouter.post('/auth/forgot-password', forgotPassword);
authRouter.post(
  '/auth/reset-password',
  checkAuth(authConfig.forgotPasswordTokenSecret, false),
  resetPassword,
);
authRouter.post('/auth/resend-confirmation-email', resendConfirmationEmail);

module.exports = authRouter;
