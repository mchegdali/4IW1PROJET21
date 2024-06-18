import { Router } from 'express';
import { createUser, getUsers } from '../controllers/users.controller.js';
import {
  validateAccessToken,
  validateAuthorizationHeader,
  validateRoles,
} from '../middlewares/auth.middleware.js';

const usersRouter = Router();

// usersRouter
//   .route('/:userId')
//   .get(getProduct)
//   .patch(updateProduct)
//   .delete(deleteProduct);
usersRouter
  .route('/')
  //   .all(
  //     validateAuthorizationHeader,
  //     validateAccessToken,
  //     validateRoles(['admin']),
  //   )
  .post(createUser)
  .get(getUsers);

export default usersRouter;
