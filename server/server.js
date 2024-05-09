import express from 'express';
import cors from 'cors';

import productsRouter from './routes/products.routes.js';

function getApp() {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.use('/products', productsRouter);

  return app;
}

export default getApp;
