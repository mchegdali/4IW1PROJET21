const { Router } = require('express');
const {
  login,
  confirm,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth.controller');
const { checkAuthHeader } = require('../middlewares/auth.middleware');

const authRouter = Router();

authRouter.post('/auth/login', login);
// authRouter.post('/register', register);
authRouter.post('/auth/confirm', checkAuthHeader, confirm);
authRouter.post('/auth/forgot-password', checkAuthHeader, forgotPassword);
authRouter.post('/auth/reset-password', checkAuthHeader, resetPassword);

module.exports = authRouter;
