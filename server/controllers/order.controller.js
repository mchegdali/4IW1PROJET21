const httpErrors = require('http-errors');
const sequelize = require('../models/sql');
const {
  orderQuerySchema,
  orderCreateSchema,
  orderUpdateSchema,
} = require('../schemas/orders.schema');
const { NotFound } = httpErrors;
const Orders = sequelize.model('orders');
const Address = sequelize.model('addresses');
const OrdersMongo = require('../models/mongo/orders.mongo');
const UsersMongo = require('../models/mongo/user.mongo');
const AddressMongo = require('../models/mongo/addresses.mongo');
const StatusMongo = require('../models/mongo/status.mongo');
const uuidSchema = require('../schemas/uuid.schema');

const { v4: uuidv4 } = require('uuid');

function generateOrderNumber() {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

async function createOrder(req, res, next) {
  try {
    const userId = req.user.id;
    const userBodyId = req.body.user;

    const isAuthorized = userId === userBodyId || req.user.role === 'admin';

    if (!isAuthorized) {
      return res.sendStatus(403);
    }

    const result = await sequelize.transaction(async (t) => {
      const user = req.user;
      const userId = await UsersMongo.findById(req.body.user);
      console.log('user found:', userId);

      if (!userId) {
        throw new NotFound('utilisateur information not found');
      }
      if (!user.basket || user.basket.length === 0) {
        throw new Error('User basket is empty');
      }

      const items = user.basket.map((item) => ({
        _id: uuidv4(),
        name: item.name,
        category: item.category,
        price: parseFloat(item.price),
      }));

      const totalPrice = items.reduce((total, item) => total + item.price, 0);

      const status = await StatusMongo.findOne({ label: 'Pending' });

      if (!status) {
        throw new NotFound('Status not found');
      }

      // Find the shipping information
      const address = user.addresses.id(req.body.address);

      if (!address) {
        throw new NotFound('adrresse information not found');
      }

      const order = await Orders.create(
        {
          userId: user._id,
          statusId: status._id,
          items: JSON.stringify(items),
          totalPrice: totalPrice + 2,
        },
        { transaction: t },
      );

      const orderMongo = {
        _id: order.id,
        orderNumber: generateOrderNumber(),
        status: {
          _id: status._id,
          label: status.label,
        },
        items: items,
        totalPrice: totalPrice.toString(),
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
        },
        address: {
          _id: address._id,
          firstName: address.firstName,
          lastName: address.lastName,
          region: address.region,
          country: address.country,
          street: address.street,
          zipCode: address.zipCode,
          city: address.city,
          phone: address.phone,
        },
      };

      const orderDoc = await OrdersMongo.create(orderMongo);

      await UsersMongo.updateOne(
        { _id: req.user.id },
        { $set: { basket: [] } },
      );

      return orderDoc;
    });

    return res.status(200).json({
      id: result.id,
    });
  } catch (error) {
    console.error('Error creating order:', error);
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
    const { data: id, success } = uuidSchema.safeParse(req.params.id);

    if (!success) {
      return res.sendStatus(404);
    }

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
    console.log('Received query:', req.query);
    const { page, text, pageSize, sortField, sortOrder } =
      orderQuerySchema.parse(req.query);

    /**
     * @type {import('mongoose').PipelineStage[]  }
     */
    const pipelineStages = [];

    if (text && text.length >= 3) {
      pipelineStages.push({
        $match: {
          $or: [
            { _id: { $regex: text, $options: 'i' } },
            { customerName: { $regex: text, $options: 'i' } },
            { customerEmail: { $regex: text, $options: 'i' } },
            { 'items.productName': { $regex: text, $options: 'i' } },
          ],
        },
      });
    }

    if (sortField && sortOrder) {
      const sortStage = {};
      const field = sortField === 'id' ? '_id' : sortField;
      sortStage[field] = sortOrder === 'asc' ? 1 : -1;
      pipelineStages.push({ $sort: sortStage });
    }

    pipelineStages.push({
      $facet: {
        metadata: [
          { $count: 'total' },
          {
            $set: {
              page,
              totalPages: { $ceil: { $divide: ['$total', pageSize] } },
              pageSize,
            },
          },
        ],
        items: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
      },
    });

    const [result] = await OrdersMongo.aggregate(pipelineStages);
    const items = result.items ?? [];
    const metadata = result.metadata[0] ?? {
      total: 0,
      page: 1,
      totalPages: 0,
      pageSize,
    };

    return res.json({ metadata, items });
  } catch (error) {
    console.error('Error in getOrders:', error);
    next(error);
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

/**
 * Récupérer le nombre de commandes par mois dans MongoDB
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getMonthlyOrderCount(req, res, next) {
  try {
    const orders = await OrdersMongo.find({});

    const orderCounts = new Map();

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const month = date.toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });
      if (orderCounts.has(month)) {
        orderCounts.set(month, orderCounts.get(month) + 1);
      } else {
        orderCounts.set(month, 1);
      }
    });

    const sortedMonths = Array.from(orderCounts.keys()).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );
    const counts = sortedMonths.map((month) => orderCounts.get(month));

    return res.json({ months: sortedMonths, counts });
  } catch (error) {
    return next(error);
  }
}

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
  getMonthlyOrderCount,
};
