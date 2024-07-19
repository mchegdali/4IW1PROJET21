const { Router } = require('express');
const {
  getBasket,
  addItemToBasket,
  removeItemFromBasket,
} = require('../controllers/basket.controller');

const userBasketRouter = Router({ mergeParams: true });

userBasketRouter
  .route('/')
  .get(getBasket)
  .post(addItemToBasket)
  .put(setItemQuantity)
  .delete(removeItemFromBasket);

module.exports = userBasketRouter;
