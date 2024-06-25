const { Router } = require('express');
const { createUser, getUsers } = require('../controllers/users.controller');
const {
  checkAccessToken,
  checkAuthHeader,
  checkRole,
} = require('../middlewares/auth.middleware');

const usersRouter = Router();

usersRouter
  .route('/users')
  .all(checkAuthHeader, checkAccessToken)
  .post(checkRole('user'), createUser)
  .get(checkRole('admin'), getUsers);

module.exports = usersRouter;
