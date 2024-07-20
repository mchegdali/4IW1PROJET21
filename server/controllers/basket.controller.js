const { z } = require('zod');
const sequelize = require('../models/sql');
const UserMongo = require('../models/mongo/user.mongo');

const Products = sequelize.model('products');
const Basket = sequelize.model('baskets');
const Users = sequelize.model('users');
const BasketItems = sequelize.model('basketsItems');

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
const getBasket = async (req, res, next) => {
  try {
    const user = await UserMongo.findById(req.params.userId);
    if (!user) {
      return res.sendStatus(404);
    }

    return res.json(user.basket);
  } catch (error) {
    return next(error);
  }
};

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
const addItemToBasket = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { productId, quantity } = z
      .object({
        productId: z.string().uuid(),
        quantity: z.coerce.number().int().min(1).default(1),
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

    const itemsToAdd = Array(quantity).fill({ productId, basketId: basket.id });

    const addedItems = await BasketItems.bulkCreate(itemsToAdd, {
      validate: true,
      returning: true,
      individualHooks: true,
    });

    console.log('nbAddedItems', addedItems.length);

    const productMongo = await product.toMongo();

    await UserMongo.updateOne(
      { _id: userId },
      {
        $push: {
          basket: Array(quantity).fill(productMongo),
        },
      },
    );

    return res.sendStatus(201);
  } catch (error) {
    return next(error);
  }
};

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
const removeItemFromBasket = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { productId, quantity } = z
      .object({
        productId: z.string().uuid(),
        quantity: z.coerce.number().int().min(1).default(1),
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
      limit: quantity,
    });

    const basketItems = await basket.getItems({
      include: {
        model: Products,
      },
    });

    const basketProducts = basketItems.map((item) =>
      item.getDataValue('product'),
    );

    const mongoBasket = await Promise.all(
      basketProducts.map((product) => product.toMongo()),
    );

    const { modifiedCount } = await UserMongo.updateOne(
      { _id: userId, 'basket._id': product.id },
      {
        basket: mongoBasket,
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

const setItemQuantity = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { productId, quantity } = z
      .object({
        productId: z.string().uuid(),
        quantity: z.coerce.number().int().min(1).default(1),
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

    const itemsToCreate = Array(quantity).fill({
      productId,
      basketId: basket.id,
    });

    await BasketItems.destroy({
      where: { productId: product.id, basketId: basket.id },
    });

    await BasketItems.bulkCreate(itemsToCreate, {
      validate: true,
      returning: true,
      individualHooks: true,
    });

    const productMongo = await product.toMongo();

    await UserMongo.updateOne(
      { _id: userId },
      {
        $pull: {
          basket: { _id: product.id },
        },
      },
    );

    await UserMongo.updateOne(
      { _id: userId },
      {
        $push: {
          basket: {
            $each: Array(quantity).fill(productMongo),
          },
        },
      },
    );

    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getBasket,
  addItemToBasket,
  removeItemFromBasket,
  setItemQuantity,
};