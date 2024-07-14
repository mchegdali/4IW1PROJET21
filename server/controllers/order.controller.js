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
/**
 * @type {import('express').RequestHandler}
 */
async function createOrder(req, res, next) {
  try {
    const orderCreateBody = await orderCreateSchema.parseAsync(req.body);
    const result = await sequelize.transaction(async (t) => {
    if (orderCreateBody.user) {
        const user = await UsersMongo.findById(
          orderCreateBody.user,
    
      );
      if (!user) {
          throw new NotFound('user introuvable');
        }
      }
     

      const data = await Orders.create(orderCreateBody, {
        transaction: t,
        include: ['user'],
      });
      console.log("data console ",data)
      const orderMongo = await data.toMongo();

      const orderDoc = await OrdersMongo.create(orderMongo);
        
      return orderDoc;
    });
    
    return res.status(201).json(result);
  } catch (error) {
    console.log(error)
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

    const shipping = await OrdersMongo.findOne(filter);
    if (!orderQuerySchema) {
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
    const sqlWhere = {
      id,
    };
    const mongoWhere = {
      _id: id,
    };

    const shippingUpdateBody = await orderUpdateSchema.parseAsync(req.body);
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

      const replaceResult = await OrdersMongo.findOneAndUpdate(
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
async function deleteOrder(req,res,next) {
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
      OrdersMongo.deleteOne(mongoWhere),
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
  createOrder,
  getOrder,
  getOrders,
  updateOrder,
  deleteOrder
};
