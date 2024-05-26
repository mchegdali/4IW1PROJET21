import express from 'express';
import cors from 'cors';

import productsRouter from './routes/products.routes.js';
import productsCategoriesRouter from './routes/products-categories.routes.js';

function getApp() {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.use('/products', productsRouter);
  app.use('/products-categories', productsCategoriesRouter);

  return app;
}

export default getApp;
