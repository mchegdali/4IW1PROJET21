import express from 'express';
import cors from 'cors';

import authRouter from './routes/auth.route.js';
import productsRouter from './routes/products.routes.js';
import productsCategoriesRouter from './routes/products-categories.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';
import usersRouter from './routes/users.routes.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/categories', productsCategoriesRouter);
app.use(errorMiddleware);

export default app;
