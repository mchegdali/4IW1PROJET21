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

    const { items: itemsProductIds } = basketCreateBody;


    if (!Array.isArray(itemsProductIds)) {
      throw new Error('items doit être un array');
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
          throw new Error('un ou plusieurs champs sont manquants');
        }
      });

      // Calculate total price of the basket
      const totalPrice = items.reduce((acc, product) => {
        const quantity = quantityMap[product._id.toString()] || 0;
        acc += parseFloat(product.price) * quantity;
        return acc;
      }, 0);

      // Create the basket in SQL
      const basket = await Baskets.create({
        user: user._id,
        totalPrice: totalPrice,
      }, { transaction: t });

      // Associate products with the basket
      for (const productId in quantityMap) {
        await basket.addProduct(productId, { transaction: t });
      }

      // Convert SQL basket to MongoDB-like object and save it to MongoDB
      const basketMongo = {
        _id: basket.id,
        items: items.map(product => ({
          _id: product._id,
          name: product.name,
          category: product.category,
          image: product.image,
          price: product.price,
          quantity: quantityMap[product._id.toString()],
        })),
        totalPrice: totalPrice,
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
        },
      };

      const basketDoc = await BasketsMongo.create(basketMongo);

      return basketDoc;
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error('creation de panier :', error);
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
    const sqlWhere = { id };
    const mongoWhere = { _id: id };


    const basketUpdateBody = await basketUpdateSchema.parseAsync(req.body);
    const updatedKeys = Object.keys(basketUpdateBody);


    let calculatedTotalPrice = null;

    if (basketUpdateBody.items) {

      const products = await Products.findAll({
        where: {
          id: basketUpdateBody.items,
        },
      });

      calculatedTotalPrice = products.reduce((total, product) => {
        return total + parseFloat(product.price);
      }, 0);

      basketUpdateBody.items.forEach((itemId) => {
        const product = products.find((p) => p.id === itemId);
        if (product) {
          const quantity = basketUpdateBody.items.filter((item) => item === itemId).length;
          product.quantity = quantity;
        }
      });
    }


    if (basketUpdateBody.totalPrice !== undefined) {

      if (calculatedTotalPrice !== null && calculatedTotalPrice !== basketUpdateBody.totalPrice) {
        return res.status(400).json({ message: 'Incohérence totalPrice avec les items fournis' });
      }
    } else if (calculatedTotalPrice !== null) {

      basketUpdateBody.totalPrice = calculatedTotalPrice;
    }

    const result = await sequelize.transaction(async (t) => {

      const [affectedRowsCount, affectedRows] = await Baskets.update(basketUpdateBody, {
        where: sqlWhere,
        limit: 1,
        transaction: t,
        returning: true,
      });

      if (affectedRowsCount === 0) {
        throw new Error('Panier introuvable');
      }

      const basket = await Baskets.findByPk(affectedRows[0].getDataValue('id'), {
        transaction: t,
      });


      const basketMongo = {};


      for (const key of updatedKeys) {
        basketMongo[key] = basket.getDataValue(key);
      }


      const replaceResult = await BasketsMongo.findOneAndUpdate(mongoWhere, basketMongo, {
        new: true,
        runValidators: true,
      });


      if (!replaceResult) {
        throw new Error('Panier introuvable dans MongoDB');
      }

      return replaceResult;
    });

    return res.status(200).json(result);
  } catch (error) {

    console.error('Erreur lors de la mise à jour du panier:', error);
    if (error.message.includes('Panier introuvable')) {
      return res.sendStatus(404);
    }
    return next(error);
  }
}
async function deleteBasket(req,res,next) {
   try {
    const id = req.params.id;


    const result = await sequelize.transaction(async (t) => {
      const deletedBasketMongo = await BasketsMongo.findByIdAndDelete(id);
      if (!deletedBasketMongo) {
        throw new Error('Panier introuvable dans MongoDB');
      }

      const deletedCountSQL = await Baskets.destroy({
        where: id,
        transaction: t,
      });

      if (deletedCountSQL === 0) {
        throw new Error('Panier introuvable dans SQL');
      }

      return deletedBasketMongo; 
    });

    return res.status(200).json({ message: 'Panier supprimée avec succès', order: result });
  } catch (error) {
    console.error('Error deleting order:', error);
    if (error.message.includes('Panier introuvable')) {
      return res.sendStatus(404);
    }
    return next(error);
  }
}
module.exports = {
  createBasket,
  getBasket,
  getBaskets,
  updateBasket,
  deleteBasket
};
