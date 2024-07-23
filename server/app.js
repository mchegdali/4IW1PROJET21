const express = require('express');
const cors = require('cors');
const logger = require('pino-http');
const helmet = require('helmet');
const path = require('path');

const corsOptions = {
  origin: process.env.APP_URL,
  optionsSuccessStatus: 200,
  credentials: true,
};

const trackingRouter = require('./routes/tracking.routes');
const authRouter = require('./routes/auth.routes');
const productsRouter = require('./routes/products.routes');
const categoriesRouter = require('./routes/categories.routes');
const usersRouter = require('./routes/users.routes');
const errorMiddleware = require('./middlewares/error.middleware');
const paymentRouter = require('./routes/payment.routes');
const { orderRouter } = require('./routes/order.routes');
const statusRouter = require('./routes/status.routes');
const stockRouter = require('./routes/stock.routes');

const app = express();

app.set('trust proxy', 1);

app.use(cors(corsOptions));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
app.use(express.json());

const staticFileMiddleware = express.static(path.join(__dirname, 'uploads'));

app.use(
  '/uploads',
  cors(),
  (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    next();
  },
  staticFileMiddleware,
);
// app.use(logger());
app.use(helmet());

app.use(authRouter);
app.use(usersRouter);
app.use(productsRouter);
app.use(categoriesRouter);
app.use(paymentRouter);
app.use(stockRouter);
app.use(orderRouter);
app.use(statusRouter);
app.use(errorMiddleware);

module.exports = app;
