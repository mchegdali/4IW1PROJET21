const httpErrors = require('http-errors');
const validator = require('validator');
const sequelize = require('../models/sql');
const {
  basketQuerySchema,
  basketCreateSchema,
  basketUpdateSchema,
} = require('../schemas/baskets.schema');
const { NotFound } = httpErrors;
const Baskets = sequelize.model('baskets');
const Products = sequelize.model('products');
const Users = sequelize.model('users');

const { ZodError } = require('zod');
const BasketsMongo = require('../models/mongo/baskets.mongo');
const formatZodError = require('../utils/format-zod-error');
const { ValidationError } = require('sequelize');
const ProductsMongo = require ("../models/mongo/products.mongo");
const UsersMongo = require ("../models/mongo/user.mongo");
/**
 * @type {import('express').RequestHandler}
 */
async function createBasket(req, res, next) {
  try {
    const userId = req.params.id; // User ID from the route parameter
    const basketCreateBody = await basketCreateSchema.parseAsync(req.body);
    console.log("FIRST LOG " , basketCreateBody)
    const { items: itemsProductIds } = basketCreateBody;
    console.log("TWO LOG " , itemsProductIds)
    if (!Array.isArray(itemsProductIds)) {
      throw new Error('itemsProduct should be an array');
    }

    const result = await sequelize.transaction(async (t) => {
      // Fetch user from MongoDB
      const user = await UsersMongo.findById(userId).exec();
      if (!user) {
        throw new NotFound('Utilisateur introuvable');
      }

      // Fetch products from MongoDB for each item individually
      const items = [];
      for (const itemId of itemsProductIds) {
        const item = await ProductsMongo.findById(itemId).exec();
        if (!item) {
          throw new NotFound(`Produit introuvable avec l'ID: ${itemId}`);
        }
        items.push(item);
      }

      // Ensure that the required fields are present
      items.forEach(product => {
        if (!product.price || !product.image || !product.name || !product._id) {
          throw new Error('One or more products are missing required fields');
        }
      });

      // Calculate total price of the basket
      const totalPrice = items.reduce((acc, product) => {
        acc += parseFloat(product.price); // Assuming product.price is a string or number
        return acc;
      }, 0);

      // Create the basket in SQL
      const basket = await Baskets.create({
        user: user._id,
        totalPrice: totalPrice,
      }, { transaction: t });

      // Associate products with the basket
      const productIds = items.map(product => product._id);
      for (const productId of productIds) {
        await basket.addProduct(productId, { transaction: t });
      }

      // Convert SQL basket to MongoDB-like object and save it to MongoDB
      const basketMongo = {
        _id: basket.id,
        items: items,
        totalPrice: totalPrice,
      };
      const basketDoc = await BasketsMongo.create(basketMongo);

      return basketDoc;
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error('Error creating basket:', error);
    return next(error);
  }
}
/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getBasket(req, res, next) {
  try {
    const id = req.params.id;

    const filter = {
      _id: id,
    };

    const shipping = await BasketsMongo.findOne(filter);
    if (!basketQuerySchema) {
      return res.sendStatus(404);
    }
    return res.json(shipping);
  } catch (error) {
    return next(error);
  }
}
/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getBaskets(req, res, next) {
  try {
    const basket = await BasketsMongo.find({}).lean({});
    return res.json(basket);
  } catch (error) {
    return next(error);
  }
}
/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function updateBasket(req, res, next) {
  try {
    const id = req.params.id;
    const sqlWhere = {
      id,
    };
    const mongoWhere = {
      _id: id,
    };

    const shippingUpdateBody = await basketUpdateSchema.parseAsync(req.body);
    const updatedKeys = Object.keys(shippingUpdateBody);

    const result = await sequelize.transaction(async (t) => {
      const [affectedRowsCount, affectedRows] = await Shippings.update(
        shippingUpdateBody,
        {
          where: sqlWhere,
          limit: 1,
          transaction: t,
          returning: true,
        },
      );

      if (affectedRowsCount === 0) {
        throw new NotFound('livraison introuvable');
      }

      const shipping = await Shippings.scope('toMongo').findByPk(
        affectedRows[0].getDataValue('id'),
        {
          transaction: t,
        },
      );

      const shippingMongo = {};

      for (const key of updatedKeys) {
        shippingMongo[key] = shipping.getDataValue(key);
      }

      const replaceResult = await BasketsMongo.findOneAndUpdate(
        mongoWhere,
        shippingMongo,
        {
          new: true,
        },
      );

      if (!replaceResult) {
        throw new NotFound('livraison introuvable');
      }

      return replaceResult;
    });

    return res.status(200).json(result);
  } catch (error) {
    console.log(error)
    return next(error);
  }
}
async function deleteBasket(req,res,next) {
  try {
     const id = req.params.id;
     const sqlWhere = {
      id,
    };
    const mongoWhere = {
      '_id' : id,
    };

    const [deletedCountSql, deletedCountMongo] = await Promise.all([
      Baskets.destroy({ where: sqlWhere }),
      BasketsMongo.deleteOne(mongoWhere),
    ]);

    if (deletedCountSql === 0 && deletedCountMongo.deletedCount === 0) {
      return res.sendStatus(404);
    }

  } catch(error) {
    console.log(error);
    return next (error);
  }
}
module.exports = {
  createBasket,
  getBasket,
  getBaskets,
  updateBasket,
  deleteBasket
};