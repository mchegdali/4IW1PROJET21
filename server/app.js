const express = require('express');
const cors = require('cors');
// const logger = require('pino-http');
const helmet = require('helmet');
const path = require('path'); // Ajouté pour le chemin du dossier

const corsOptions = {
  origin: process.env.APP_URL,
  optionsSuccessStatus: 200,
  credentials: true,
};

const authRouter = require('./routes/auth.routes');
const productsRouter = require('./routes/products.routes');
const categoriesRouter = require('./routes/categories.routes');
const usersRouter = require('./routes/users.routes');
const errorMiddleware = require('./middlewares/error.middleware');
const paymentRouter = require('./routes/payment.routes');
const trackingRouter = require('./routes/tracking.routes');
const { orderRouter } = require('./routes/order.routes');
const statusRouter = require('./routes/status.routes'); // Importez le routeur de status

const app = express();

app.set('trust proxy', 1);

app.use(express.json());
app.use(cors(corsOptions)); // Middleware CORS global pour toutes les routes
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Désactiver la politique de ressource cross-origin
  }),
);

// Utiliser le middleware CORS uniquement pour les routes de fichiers statiques
const staticFileMiddleware = express.static(path.join(__dirname, 'uploads'));

app.use('/v1/tracking', trackingRouter);
app.use('/uploads', staticFileMiddleware);
app.use(helmet());

app.use(authRouter);
app.use(usersRouter);
app.use(productsRouter);
app.use(categoriesRouter);
app.use(
  cors({
    origin: '*',
    optionsSuccessStatus: 200,
    credentials: true,
  }),
  paymentRouter,
);
app.use(orderRouter);
app.use(statusRouter); // Ajoutez le routeur de status
app.use(errorMiddleware);

module.exports = app;
