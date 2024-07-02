const express = require('express');
const cors = require('cors');

const authRouter = require('./routes/auth.routes');
const productsRouter = require('./routes/products.routes');
const categoriesRouter = require('./routes/categories.routes');
const usersRouter = require('./routes/users.routes');
const shippingRouter = require('./routes/shipping.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();
app.use(express.json());
app.use(cors());

app.use(authRouter);
app.use(usersRouter);
app.use(productsRouter);
app.use(categoriesRouter);
app.use(shippingRouter);
app.use(errorMiddleware);

module.exports = app;
