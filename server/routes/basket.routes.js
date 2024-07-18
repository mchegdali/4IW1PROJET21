const { Router } = require('express');
const {
  createBasket,
  deleteBasket,
  getBasket,
  getBaskets,
  updateBasket,
} = require('../controllers/basket.controller');

const userBasketRouter = Router({ mergeParams: true });
const basketsRouter = Router();

userBasketRouter.route('/basket').patch(updateBasket).delete(deleteBasket);

basketsRouter.route('/baskets').get(getBaskets).post(createBasket);
basketsRouter.route('/baskets/:id').get(getBasket);

module.exports = { userBasketRouter, basketsRouter };
