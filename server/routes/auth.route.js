import { Router } from 'express';
import { login, register, confirm } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.get('/confirm', confirm);

export default authRouter;
