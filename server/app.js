const express = require('express');
const cors = require('cors');
const logger = require('pino-http');
const helmet = require('helmet');

const authRouter = require('./routes/auth.routes');
const productsRouter = require('./routes/products.routes');
const categoriesRouter = require('./routes/categories.routes');
const usersRouter = require('./routes/users.routes');
const shippingRouter = require('./routes/shipping.routes');
const errorMiddleware = require('./middlewares/error.middleware');
const addressesRouter = require('./routes/addresses.routes');

const app = express();

app.set('trust proxy', 1);

app.use(express.json());
app.use(cors());
app.use(logger());
app.use(helmet());

app.use(authRouter);
app.use(usersRouter);
app.use(productsRouter);
app.use(categoriesRouter);
app.use(shippingRouter);
app.use(addressesRouter);
app.use(errorMiddleware);

module.exports = app;
