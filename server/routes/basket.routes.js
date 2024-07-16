const { Router } = require('express');
const {
  createBasket,
 deleteBasket,
  getBasket,
  getBaskets,
  updateBasket,
} = require('../controllers/basket.controller');

const basketRouter = Router();



// basketRouter.get('/deliveryChoices/:id/shipping', getShipping);
basketRouter.post('/users/:id/basket',createBasket);
basketRouter
  .route('/basket/:id')
  .get(getBasket)
  .patch(updateBasket)
  .delete(deleteBasket);

basketRouter.route('/basket').get(getBaskets)

module.exports = basketRouter;