const httpErrors = require('http-errors');
const validator = require('validator');
const sequelize = require('../models/sql');
const {
  orderQuerySchema,
  orderCreateSchema,
  orderUpdateSchema,
} = require('../schemas/orders.schema');
const { NotFound } = httpErrors;
const Orders = sequelize.model('orders');
const { ZodError } = require('zod');
const OrdersMongo = require('../models/mongo/orders.mongo');
const formatZodError = require('../utils/format-zod-error');
const { ValidationError } = require('sequelize');
const UsersMongo = require ("../models/mongo/user.mongo");
const BasketsMongo = require ("../models/mongo/baskets.mongo")
/**
 * @type {import('express').RequestHandler}
 */
async function createOrder(req, res, next) {
  try {

    const orderCreateBody = await orderCreateSchema.parseAsync(req.body);
    

    const result = await sequelize.transaction(async (t) => {
      if (orderCreateBody.user) {
        const user = await UsersMongo.findById(
          orderCreateBody.user,);
          if (!user) {
            throw new NotFound('Utilisateur introuvable');
          }
        
      }
      const user = await UsersMongo.findById(
        orderCreateBody.user,);

      const basket = await BasketsMongo.findOne({
        user : user
      })
      .sort({ createdAt: -1 }) 
      .exec();
      
      if (!basket) {
        throw new NotFound('Panier introuvable');
      }

      const { items, totalPrice } = basket;

      const order = await Orders.create({
        user: user._id,
        paymentStatus: 'Pending',
        deliveryStatus: 'Pending',
        orderStatus: 'Pending',
        items: JSON.stringify(items), 
        totalPrice: totalPrice,
      }, { transaction: t });

      const orderMongo = {
        _id: order.id,
        paymentStatus: order.paymentStatus,
        deliveryStatus: order.deliveryStatus,
        orderStatus: order.orderStatus,
        items: items.map(item => ({
          _id: item._id.toString(), 
          name: item.name,
          category: item.category,
          image: item.image,
          price: item.price,
          quantity: item.quantity
        })),
        totalPrice: totalPrice.toString(), 
        user: {
          _id: user._id, 
          fullname: user.fullname,
          email: user.email,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const orderDoc = await OrdersMongo.create(orderMongo);
      return orderDoc;
    });

    return res.status(201).json(result);
  } catch (error) {
    console.log('Error creating order:', error);
    if (error instanceof NotFound) {
      return res.sendStatus(404);
    }
    return next(error);
  }
}


/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getOrder(req, res, next) {
  try {
    const id = req.params.id;

    const filter = {
      _id: id,
    };

    const order = await OrdersMongo.findOne(filter);
    if (!orderQuerySchema) {
      return res.sendStatus(404);
    }
    return res.json(order);
  } catch (error) {
    return next(error);
  }
}
/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getOrders(req, res, next) {
  try {
    const basket = await OrdersMongo.find({}).lean({});
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
async function updateOrder(req, res, next) {
  try {
    const id = req.params.id;
    const sqlWhere = { id };
    const mongoWhere = { _id: id };

    const orderUpdateBody = await orderUpdateSchema.parseAsync(req.body);
    const updatedKeys = Object.keys(orderUpdateBody);

    const result = await sequelize.transaction(async (t) => {
      const [affectedRowsCount, affectedRows] = await Orders.update(orderUpdateBody, {
        where: sqlWhere,
        limit: 1,
        transaction: t,
        returning: true,
      });

      if (affectedRowsCount === 0) {
        throw new Error('Commande introuvable');
      }

      const order = await Orders.findByPk(affectedRows[0].getDataValue('id'), {
        transaction: t,
      });

      const orderMongo = {};

      for (const key of updatedKeys) {
        orderMongo[key] = order.getDataValue(key);
      }

      const replaceResult = await OrdersMongo.findOneAndUpdate(mongoWhere, orderMongo, {
        new: true,
        runValidators: true,
      });

      if (!replaceResult) {
        throw new Error('Commande introuvable dans MongoDB');
      }

      return replaceResult;
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error updating order:', error);
    if (error.message.includes('Commande introuvable')) {
      return res.sendStatus(404);
    }
    return next(error);
  }
}

async function deleteOrder(req, res, next) {
  try {
    const id = req.params.id;



    const result = await sequelize.transaction(async (t) => {
      const deletedOrderMongo = await OrdersMongo.findByIdAndDelete(id);
      if (!deletedOrderMongo) {
        throw new Error('Commande introuvable dans MongoDB');
      }

      const deletedCountSQL = await Orders.destroy({
        where: id,
        transaction: t,
      });

      if (deletedCountSQL === 0) {
        throw new Error('Commande introuvable dans SQL');
      }

      return deletedOrderMongo;
    });

    return res.status(200).json({ message: 'Commande supprimée avec succès', order: result });
  } catch (error) {
    console.error('Error deleting order:', error);
    if (error.message.includes('Commande introuvable')) {
      return res.sendStatus(404);
    }
    return next(error);
  }
}
module.exports = {

  createOrder,
  getOrder,
  getOrders,
  updateOrder,
  deleteOrder
};
