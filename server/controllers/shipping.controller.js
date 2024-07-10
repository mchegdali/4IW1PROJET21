const httpErrors = require('http-errors');
const validator = require('validator');
const sequelize = require('../models/sql');
const {
  shippingQuerySchema,
  shippingCreateSchema,
  shippingUpdateSchema,
} = require('../schemas/shipping.schema');
const { NotFound } = httpErrors;
const Shippings = sequelize.model('shippings');
const { ZodError } = require('zod');
const ShippingMongo = require('../models/mongo/shipping.mongo');
const formatZodError = require('../utils/format-zod-error');
const { ValidationError } = require('sequelize');
const deliveryChoiceMongo = require('../models/mongo/deliveryChoice.mongo');

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function createShipping(req, res, next) {
  try {
    const shippingCreateBody = await shippingCreateSchema.parseAsync(req.body);
    console.log(shippingCreateBody,"deliveryChoice : " +  shippingCreateBody.deliveryChoice)
    const result = await sequelize.transaction(async (t) => {
      if (shippingCreateBody.deliveryChoice) {
        const deliveryChoice = await deliveryChoiceMongo.findById(
          shippingCreateBody.deliveryChoice,
    
      );
      if (!deliveryChoice) {
          throw new NotFound('livraison introuvable');
        }
      }
      const data = await Shippings.create(shippingCreateBody, {
        transaction: t,
        include: ['deliveryChoice'],
      });
      console.log(data)
           const shippingMongo = await data.toMongo();

      const shippingDoc = await ShippingMongo.create(shippingMongo);
        
      return shippingDoc;
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
async function getShipping(req, res, next) {
  try {
    const id = req.params.id;

    const filter = {
      _id: id,
    };

    const shipping = await ShippingMongo.findOne(filter);
    if (!shippingQuerySchema) {
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
async function updateShipping(req, res, next) {
  try {
    const id = req.params.id;
    const sqlWhere = {
      id,
    };
    const mongoWhere = {
      _id: id,
    };

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

      const replaceResult = await ShippingMongo.findOneAndUpdate(
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
module.exports = {
  createShipping,
  getShipping,
  updateShipping,
};
