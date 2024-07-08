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
const ShippingMongo = require('../models/mongo/shipping');
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
    console.log(shippingCreateBody,"deliveryChoice : " +  shippingCreateBody.deliveryChoiceId)
    const result = await sequelize.transaction(async (t) => {
      if (shippingCreateBody.deliveryChoiceId) {
        const deliveryChoice = await deliveryChoiceMongo.findById(
          shippingCreateBody.deliveryChoiceId,
    
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
async function getShipping(req, res) {
  try {
    const shipping = req.params.shipping;
    const shippingDoc = await ShippingMongo.findOne({
      shipping,
    });
    return shippingDoc;
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(422).json({ errors: error.errors });
    }
    if (error instanceof ZodError) {
      return res.status(422).json({ errors: formatZodError(error) });
    }
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

// async function updateProduct(req, res) {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     Object.assign(product, req.body);
//     await product.save();
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// async function deleteProduct(req, res) {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     await product.remove();
//     res.json({ message: 'Product deleted' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

module.exports = {
  createShipping,
  getShipping,
};
