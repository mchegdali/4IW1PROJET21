const httpErrors = require('http-errors');
const sequelize = require('../models/sql');
const {
  orderQuerySchema,
  orderCreateSchema,
  orderUpdateSchema,
} = require('../schemas/orders.schema');
const { NotFound } = httpErrors;
const Orders = sequelize.model('orders');
const Shippings = sequelize.model('shippings')
const OrdersMongo = require('../models/mongo/orders.mongo');

const UsersMongo = require ("../models/mongo/user.mongo");
const BasketsMongo = require ("../models/mongo/baskets.mongo")
const ShippingsMongo = require ("../models/mongo/shipping.mongo")

/**
 * @type {import('express').RequestHandler}
 */
async function createOrder(req, res, next) {
  try {
    const orderCreateBody = await orderCreateSchema.parseAsync(req.body);
    const user = await UsersMongo.findById(orderCreateBody.user);

    const result = await sequelize.transaction(async (t) => {
      const userId = await UsersMongo.findById(orderCreateBody.user);
      if (!userId) {
        throw new NotFound();
      }

      const shipping = await ShippingsMongo.findById(orderCreateBody.shipping);
      if (!shipping) {
        throw new NotFound();
      }

      const basket = await BasketsMongo.findOne({ user: user })
        .sort({ createdAt: -1 })
        .exec();

      if (!basket) {
        throw new NotFound();
      }
      const { items, totalPrice } = basket;

      const order = await Orders.create({
        userId: user._id,
        paymentStatus: 'Pending',
        deliveryStatus: 'Pending',
        orderStatus: 'Pending',
        items: JSON.stringify(items),
        totalPrice: totalPrice,
      }, { transaction: t });

      await Shippings.update(
        { order: order.id },
        { where: { id: shipping.id }, transaction: t }
      );

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
        shipping: {
          _id: shipping.id,
          fullname: shipping.fullname,
          street: shipping.street,
          zipCode: shipping.zipCode,
          city: shipping.city,
          phone: shipping.phone,
          deliveryChoiceId: shipping.deliveryChoiceId,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const orderDoc = await OrdersMongo.create(orderMongo);
      return orderDoc;
    });

    return res.status(201).json(result);
  } catch (error) {
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
        throw new NotFound();
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
        throw new NotFound();
      }

      return replaceResult;
    });

    return res.status(204).json(result);
  } catch (error) {

   
    return next(error);
  }
}

async function deleteOrder(req, res, next) {
  try {
    const id = req.params.id;



    const result = await sequelize.transaction(async (t) => {
      const deletedOrderMongo = await OrdersMongo.findByIdAndDelete(id);
      if (!deletedOrderMongo) {
        throw new NotFound();
      }

      const deletedCountSQL = await Orders.destroy({
        where: id,
        transaction: t,
      });

      if (deletedCountSQL === 0) {
        throw new NotFound();
      }

      return deletedOrderMongo;
    });

    return res.status(204);
  } catch (error) {

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
