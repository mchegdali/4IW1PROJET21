const express = require('express');
const cors = require('cors');
const logger = require('pino-http');
const helmet = require('helmet');
<<<<<<< HEAD
const path = require('path'); // Ajouté pour le chemin du dossier
=======
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true,
};
>>>>>>> 4556f53 (payment2 liaison back front debut page payment confirmation)

const authRouter = require('./routes/auth.routes');
const productsRouter = require('./routes/products.routes');
const categoriesRouter = require('./routes/categories.routes');
const usersRouter = require('./routes/users.routes');
const shippingRouter = require('./routes/shipping.routes');
const errorMiddleware = require('./middlewares/error.middleware');
const deliveryChoiceRouter = require('./routes/deliveryChoice.routes');
const paymentRouter = require('./routes/payment.routes');
const { orderRouter } = require('./routes/order.routes');
const statusRouter = require('./routes/status.routes'); // Importez le routeur de status

const app = express();

app.set('trust proxy', 1);

app.use(express.json());
<<<<<<< HEAD
app.use(cors()); // Middleware CORS global pour toutes les routes
app.use(helmet({
  crossOriginResourcePolicy: false, // Désactiver la politique de ressource cross-origin
}));

// Configurer les en-têtes CORS pour toutes les réponses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Utiliser le middleware CORS uniquement pour les routes de fichiers statiques
const staticFileMiddleware = express.static(path.join(__dirname, 'uploads'));

app.use('/uploads', cors(), (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}, staticFileMiddleware);
=======
app.use(cors(corsOptions));
// app.use(logger());
app.use(helmet());
>>>>>>> 4556f53 (payment2 liaison back front debut page payment confirmation)

app.use(authRouter);
app.use(usersRouter);
app.use(productsRouter);
app.use(categoriesRouter);
app.use(shippingRouter);
app.use(deliveryChoiceRouter);
app.use(paymentRouter);
app.use(orderRouter);
app.use(statusRouter); // Ajoutez le routeur de status
app.use(errorMiddleware);

module.exports = app;
