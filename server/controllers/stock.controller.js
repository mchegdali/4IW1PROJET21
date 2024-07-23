const httpErrors = require('http-errors');
const validator = require('validator');
const StockItemMongo = require('../models/mongo/stock.mongo');
const { ProductMongo } = require('../models/mongo/products.mongo');
const {
  stockItemCreateSchema,
  stockItemQuerySchema,
  stockItemUpdateSchema,
} = require('../schemas/stock.schema');

const { NotFound } = httpErrors;

/**
 * @type {import('express').RequestHandler}
 */
async function createStockItem(req, res, next) {
  try {
    const stockItemCreateBody = await stockItemCreateSchema.parseAsync(
      req.body,
    );

    const product = await ProductMongo.findById(stockItemCreateBody.productId);
    if (!product) {
      return res.sendStatus(404);
    }

    const stockItem = await StockItemMongo.create({
      ...stockItemCreateBody,
      product: product.toObject(),
    });

    return res.status(201).json(stockItem);
  } catch (error) {
    return next(error);
  }
}

/**
 * @type {import('express').RequestHandler}
 */
async function getStockItems(req, res, next) {
  try {
    const {
      page,
      pageSize,
      productId,
      expirationDateBefore,
      expirationDateAfter,
    } = stockItemQuerySchema.parse(req.query);

    const matchStage = {};

    if (productId) {
      matchStage['product._id'] = productId;
    }

    if (expirationDateBefore || expirationDateAfter) {
      matchStage.expirationDate = {};
      if (expirationDateBefore) {
        matchStage.expirationDate.$lte = new Date(expirationDateBefore);
      }
      if (expirationDateAfter) {
        matchStage.expirationDate.$gte = new Date(expirationDateAfter);
      }
    }

    const pipeline = [
      { $match: matchStage },
      {
        $facet: {
          metadata: [
            { $count: 'total' },
            {
              $addFields: {
                page,
                totalPages: { $ceil: { $divide: ['$total', pageSize] } },
                pageSize,
              },
            },
          ],
          data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
        },
      },
    ];

    const result = await StockItemMongo.aggregate(pipeline);

    return res.json({
      metadata: result[0].metadata[0] ?? {
        total: 0,
        page: 1,
        totalPages: 0,
        pageSize,
      },
      data: result[0].data,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @type {import('express').RequestHandler}
 */
async function getStockItem(req, res, next) {
  try {
    const isUUID = validator.isUUID(req.params.stockItemId);

    if (!isUUID) {
      return res.sendStatus(404);
    }

    const stockItem = await StockItemMongo.findById(req.params.stockItemId);

    if (!stockItem) {
      return res.sendStatus(404);
    }
    return res.json(stockItem);
  } catch (error) {
    return next(error);
  }
}

/**
 * @type {import('express').RequestHandler}
 */
async function updateStockItem(req, res, next) {
  try {
    const stockItemUpdateBody = stockItemUpdateSchema.parse(req.body);

    const updatedStockItem = await StockItemMongo.findByIdAndUpdate(
      req.params.stockItemId,
      stockItemUpdateBody,
      { new: true, runValidators: true },
    );

    if (!updatedStockItem) {
      throw new NotFound('Stock item non trouvé');
    }

    return res.status(200).json(updatedStockItem);
  } catch (error) {
    return next(error);
  }
}

/**
 * @type {import('express').RequestHandler}
 */
async function deleteStockItem(req, res, next) {
  try {
    const deletedStockItem = await StockItemMongo.findByIdAndDelete(
      req.params.stockItemId,
    );

    if (!deletedStockItem) {
      return res.sendStatus(404);
    }

    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
}

/**
 * @type {import('express').RequestHandler}
 */
async function getStockItemDistributionByProduct(req, res, next) {
  try {
    const distribution = await StockItemMongo.aggregate([
      {
        $group: {
          _id: '$product.name',
          count: { $sum: 1 },
        },
      },
    ]);
    return res.status(200).json(distribution);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createStockItem,
  getStockItems,
  getStockItem,
  updateStockItem,
  deleteStockItem,
  getStockItemDistributionByProduct,
};
