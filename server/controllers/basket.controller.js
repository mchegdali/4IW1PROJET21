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
    console.log("FIRST LOG", basketCreateBody);
    const { items: itemsProductIds } = basketCreateBody;
    console.log("SECOND LOG", itemsProductIds);

    if (!Array.isArray(itemsProductIds)) {
      throw new Error('itemsProduct should be an array');
    }

    const result = await sequelize.transaction(async (t) => {
      // Fetch user from MongoDB
      const user = await UsersMongo.findById(userId).exec();
      if (!user) {
        throw new NotFound('Utilisateur introuvable');
      }

      // Create quantity map
      const quantityMap = {};
      itemsProductIds.forEach(productId => {
        quantityMap[productId] = (quantityMap[productId] || 0) + 1;
      });
      console.log("THIRD LOG", quantityMap);

      // Fetch products from MongoDB
      const items = await ProductsMongo.find({
        _id: { $in: Object.keys(quantityMap) }
      }).exec();

      if (!items.length) {
        throw new NotFound('Produits introuvables');
      }

      // Ensure that the required fields are present
      items.forEach(product => {
        if (!product.price || !product.image || !product.name || !product._id) {
          throw new Error('One or more products are missing required fields');
        }
      });

      // Calculate total price of the basket
      const totalPrice = items.reduce((acc, product) => {
        const quantity = quantityMap[product._id.toString()] || 0;
        acc += parseFloat(product.price) * quantity;
        return acc;
      }, 0);

      // Convert quantityMap to array format for SQL
      const quantityArray = Object.entries(quantityMap).map(([uuid, nbOccurence]) => ({ uuid, nbOccurence }));

      // Create the basket in SQL
      const basket = await Baskets.create({
        user: user._id,
        totalPrice: totalPrice,
        quantity: quantityArray,
      }, { transaction: t });
      console.log("four log ", basket)
      // Associate products with the basket
      for (const productId in quantityMap) {
        await basket.addProduct(productId, { transaction: t });
      }

      // Convert SQL basket to MongoDB-like object and save it to MongoDB
      const basketMongo = {
        _id: basket.id,
        items: items,
        totalPrice: totalPrice,
        quantity: Object.entries(quantityMap).map(([uuidProd, nbOccurence]) => ({
          uuidProd,
          nbOccurence: nbOccurence.toString(),
        })),
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
        },
      };
      console.log(basketMongo)

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
