const httpErrors = require('http-errors');
const sequelize = require('../models/sql');
const {
  orderQuerySchema,
  orderCreateSchema,
  orderUpdateSchema,
} = require('../schemas/orders.schema');
const { NotFound } = httpErrors;
const Orders = sequelize.model('orders');
const Shippings = sequelize.model('shippings');
const OrdersMongo = require('../models/mongo/orders.mongo');
const UsersMongo = require('../models/mongo/user.mongo');
const ShippingsMongo = require('../models/mongo/shipping.mongo');
const StatusMongo = require('../models/mongo/status.mongo');

/**
 * @type {import('express').RequestHandler}
 */
async function createOrder(req, res, next) {
  try {
    const orderCreateBody = await orderCreateSchema.parseAsync(req.body);

    const result = await sequelize.transaction(async (t) => {
      const user = await UsersMongo.findById(orderCreateBody.user);
      if (!user) {
        throw new NotFound();
      }

      const shipping = await ShippingsMongo.findById(orderCreateBody.shipping);
      if (!shipping) {
        throw new NotFound();
      }

      const basket = user.basket;

      if (!basket) {
        throw new NotFound();
      }
      const { items, totalPrice } = basket;

      const status = await StatusMongo.findOne({ label: 'Pending' });
      if (!status) {
        throw new NotFound('Status not found');
      }

      const order = await Orders.create(
        {
          userId: user._id,
          statusId: status._id,
          items: JSON.stringify(items),
          totalPrice: totalPrice,
        },
        { transaction: t },
      );

      await Shippings.update(
        { order: order.id },
        { where: { id: shipping.id }, transaction: t },
      );

      const orderMongo = {
        _id: order.id,
        status: {
          _id: status._id,
          label: status.label,
        },
        items: items.map((item) => ({
          _id: item._id.toString(),
          name: item.name,
          category: item.category,
          image: item.image,
          price: item.price,
          quantity: item.quantity || 1,
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
    if (!order) {
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
      const [affectedRowsCount, affectedRows] = await Orders.update(
        orderUpdateBody,
        {
          where: sqlWhere,
          limit: 1,
          transaction: t,
          returning: true,
        },
      );

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

      const replaceResult = await OrdersMongo.findOneAndUpdate(
        mongoWhere,
        orderMongo,
        {
          new: true,
          runValidators: true,
        },
      );

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

    await sequelize.transaction(async (t) => {
      const deletedOrderMongo = await OrdersMongo.findByIdAndDelete(id);
      if (!deletedOrderMongo) {
        throw new NotFound();
      }

      const deletedCountSQL = await Orders.destroy({
        where: { id },
        transaction: t,
      });

      if (deletedCountSQL === 0) {
        throw new NotFound();
      }

      return deletedOrderMongo;
    });

    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
}

/**
 * Récupérer le nombre total de commandes dans MongoDB
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getOrderCount(req, res, next) {
  try {
    const count = await OrdersMongo.countDocuments();
    return res.status(200).json({ count });
  } catch (error) {
    return next(error);
  }
}

/**
 * Récupérer le chiffre d'affaires total dans MongoDB
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getTotalRevenue(req, res, next) {
  try {
    const totalRevenueData = await OrdersMongo.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $multiply: [
                {
                  $convert: {
                    input: '$items.price',
                    to: 'double',
                    onError: 0,
                    onNull: 0,
                  },
                },
                { $ifNull: ['$items.quantity', 1] },
              ],
            },
          },
        },
      },
      { $project: { _id: 0, totalRevenue: 1 } },
    ]);

    console.log('Total Revenue Data:', totalRevenueData);

    const totalRevenue = totalRevenueData[0]?.totalRevenue || 0;

    return res.status(200).json({ totalRevenue });
  } catch (error) {
    console.error('Error calculating total revenue:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * Récupère la répartition des commandes par status dans MongoDB
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getOrderStatusDistribution(req, res, next) {
  try {
    const distribution = await OrdersMongo.aggregate([
      {
        $group: {
          _id: '$status.label',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          label: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    return res.status(200).json(distribution);
  } catch (error) {
    return next(error);
  }
}

/**
 * Récupére le nombre total de ventes basé sur les produits dans les commandes
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getTotalSales(req, res, next) {
  try {
    const orders = await OrdersMongo.aggregate([
      { $unwind: '$items' },
      { $group: { _id: null, totalSales: { $sum: 1 } } },
    ]);

    const totalSales = orders.length ? orders[0].totalSales : 0;
    return res.status(200).json({ totalSales });
  } catch (error) {
    return next(error);
  }
}

/**
 * Compte les clients distincts dans orders
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getDistinctCustomerCount(req, res, next) {
  try {
    const distinctCustomers = await OrdersMongo.aggregate([
      { $group: { _id: '$user._id' } },
      { $count: 'distinctCustomerCount' },
    ]);

    const count =
      distinctCustomers.length > 0
        ? distinctCustomers[0].distinctCustomerCount
        : 0;

    return res.status(200).json({ distinctCustomerCount: count });
  } catch (error) {
    return next(error);
  }
}

/**
 * Calcule la distribution des produits les plus vendus
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getTopProductsDistribution(req, res, next) {
  try {
    const productsDistribution = await OrdersMongo.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items._id',
          name: { $first: '$items.name' },
          totalSold: { $sum: '$items.quantity' },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          _id: 1,
          name: 1,
          totalSold: 1,
          price: '$product.price',
        },
      },
    ]);

    const totalProductsSold = productsDistribution.reduce(
      (acc, product) => acc + product.totalSold,
      0,
    );
    const productsWithPercentage = productsDistribution.map((product) => ({
      ...product,
      percentage:
        totalProductsSold > 0
          ? (product.totalSold / totalProductsSold) * 100
          : 0,
    }));

    res.status(200).json(productsWithPercentage);
  } catch (error) {
    return next(error);
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
const getUserOrders = async (req, res, next) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    console.log(req.user);
    const orders = await OrdersMongo.find({ 'user._id': userId }).lean();

    if (orders.length === 0) {
      return res.sendStatus(404);
    }

    return res.status(200).json(orders);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createOrder,
  getOrder,
  getOrders,
  updateOrder,
  deleteOrder,
  getOrderCount,
  getTotalRevenue,
  getOrderStatusDistribution,
  getTotalSales,
  getDistinctCustomerCount,
  getUserOrders,
  getTopProductsDistribution,
};
