const httpErrors = require('http-errors');
const sequelize = require('../models/sql');
const {
  shippingQuerySchema,
  shippingCreateSchema,
  shippingUpdateSchema,
} = require('../schemas/shipping.schema');
const { NotFound } = httpErrors;
const Shippings = sequelize.model('shippings');

const ShippingMongo = require('../models/mongo/shipping.mongo');

const DeliveryChoiceMongo = require('../models/mongo/deliveryChoice.mongo');

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */

async function createShipping(req, res, next) {
  try {
    const shippingCreateBody = await shippingCreateSchema.parseAsync(req.body);

    const result = await sequelize.transaction(async (t) => {
      const deliveryChoiceId = await DeliveryChoiceMongo.findById(
        shippingCreateBody.deliveryChoiceId,
      );

      const shipping = await Shippings.create(
        {
          fullname: shippingCreateBody.fullname,
          street: shippingCreateBody.street,
          zipCode: shippingCreateBody.zipCode,
          city: shippingCreateBody.city,
          phone: shippingCreateBody.phone,
          deliveryChoiceId: deliveryChoiceId._id,
        },
        { transaction: t },
      );

      const shippingMongo = {
        _id: shipping.id,
        fullname: shipping.fullname,
        street: shipping.street,
        zipCode: shipping.zipCode,
        city: shipping.city,
        phone: shipping.phone,
        deliveryChoiceId: deliveryChoiceId._id,
      };

      const shippingDoc = await ShippingMongo.create(shippingMongo);
      return shippingDoc;
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
async function getShipping(req, res, next) {
  try {
    const id = req.params.id;

    const filter = {
      _id: id,
    };

    const shipping = await ShippingMongo.findOne(filter);
    if (!shippingQuerySchema) {
      return new NotFound();
    }
    return res.json(shipping);
  } catch (error) {
    return next(error);
  }
}
async function getShippings(req, res, next) {
  try {
    const shipping = await ShippingMongo.find({}).lean({});
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

async function updateShipping(req, res, next) {
  try {
    const id = req.params.id;
    const sqlWhere = { id };
    const mongoWhere = { _id: id };

    const shippingUpdateBody = await shippingUpdateSchema.parseAsync(req.body);
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
        throw NotFound();
      }

      const order = await Shippings.findByPk(
        affectedRows[0].getDataValue('id'),
        {
          transaction: t,
        },
      );

      const shippingMongo = {};

      for (const key of updatedKeys) {
        shippingMongo[key] = order.getDataValue(key);
      }

      const replaceResult = await ShippingMongo.findOneAndUpdate(
        mongoWhere,
        shippingMongo,
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

    return res.status(204);
  } catch (error) {
    return next(error);
  }
}

async function deleteShipping(req, res, next) {
  try {
    const id = req.params.id;

    const result = await sequelize.transaction(async (t) => {
      const deletedShippingMongo = await ShippingMongo.findByIdAndDelete(id);
      if (!deletedShippingMongo) {
        throw new NotFound();
      }

      const deletedCountSQL = await Shippings.destroy({
        where: id,
        transaction: t,
      });

      if (deletedCountSQL === 0) {
        throw new NotFound();
      }

      return deletedShippingMongo;
    });

    return res.status(204);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createShipping,
  getShipping,
  updateShipping,
  deleteShipping,
  getShippings,
};
