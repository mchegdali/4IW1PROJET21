const { z } = require('zod');
const httpErrors = require('http-errors');
const validator = require('validator');
const sequelize = require('../models/sql');
const UsersMongo = require('../models/mongo/user.mongo');
const UserMongo = require('../models/mongo/user.mongo');
const { NotFound } = httpErrors;

const Products = sequelize.model('products');
const Basket = sequelize.model('baskets');
const Users = sequelize.model('users');
const BasketItems = sequelize.model('basketsItems');
const Basket = sequelize.model('baskets');
const Users = sequelize.model('users');
const BasketItems = sequelize.model('basketsItems');

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
const getBasket = async (req, res, next) => {
const getBasket = async (req, res, next) => {
  try {
    const user = await UserMongo.findById(req.params.userId);
    if (!user) {
    const user = await UserMongo.findById(req.params.userId);
    if (!user) {
      return res.sendStatus(404);
    }

    return res.json(user.basket);

    return res.json(user.basket);
  } catch (error) {
    return next(error);
  }
};

};

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
const addItemToBasket = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { productId } = z
      .object({
        productId: z.string().uuid(),
      })
      .parse(req.body);

    const [user, product] = await Promise.all([
      Users.findByPk(userId),
      Products.findByPk(productId),
    ]);

    if (!user || !product) {
      return res.sendStatus(404);
    }

    let basket = await user.getBasket();

    if (!basket) {
      basket = await user.createBasket();
    }

    await basket.createItem({ productId });
    const productMongo = await product.toMongo();

    await UserMongo.updateOne(
      { _id: userId },
      {
        $push: {
          basket: productMongo,
        },
      },
    );

    return res.sendStatus(201);
  } catch (error) {
    return next(error);
  }
};

};

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
const removeItemFromBasket = async (req, res, next) => {
const removeItemFromBasket = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { productId } = z
      .object({
        productId: z.string().uuid(),
      })
      .parse(req.body);

    let basket = await Basket.findOne({
      where: { userId },
    });

    if (!basket) {
      basket = await Basket.create({ userId });
    }

    const product = await Products.findByPk(productId);
    if (!product) {
      return res.sendStatus(404);
    }

    const deletedCount = await BasketItems.destroy({
      where: { productId: product.id, basketId: basket.id },
      limit: 1,
    });

    const { modifiedCount } = await UserMongo.updateOne(
      { _id: userId, 'basket._id': product.id },
      {
        $pull: {
          basket: {
            _id: product.id,
          },
        },
      },
    );

    if (deletedCount === 0 && modifiedCount === 0) {
      return res.sendStatus(404);
    }

    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getBasket,
  addItemToBasket,
  removeItemFromBasket,
};