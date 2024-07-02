const { ZodError } = require('zod');
const ShippingMongo = require('../models/mongo/shipping');
const { shippingCreateSchema } = require('../schemas/shipping.schema');
const formatZodError = require('../utils/format-zod-error');
const { ValidationError } = require('sequelize');
const sequelize = require('../models/sql');

const Shipping = sequelize.model('shippings');

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function createShipping(req, res, next) {
  try {
    const result = await sequelize.transaction(async (t) => {
      const shippingCreateBody = await shippingCreateSchema.parseAsync(
        req.body,
      );

      const newData = await Shipping.create(shippingCreateBody, {
        transaction: t,
      });

      const shipping = {
        id: newData.id,
        fullname: newData.fullname,
        city: newData.city,
        emailCustomer: newData.emailCustomer,
        street: newData.street,
        zipCode: newData.zipCode,
        phone: newData.phone,
      };

      const shippingDoc = await ShippingMongo.create(shipping);

      return shippingDoc;
    });

    return res.status(201).json(result);
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

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getShipping(req, res) {
  try {
    const shipping = req.params.shipping;
    const shippingDoc = await ShippingMongo.findOne({
       shipping
    });
    return  shippingDoc;
  }catch(error) {
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

async function getAllShipping(req, res, next) {
  try {
    const shipping = await ShippingMongo.findAll({
      where: req.query,
    });
    
    if (!shipping) {
      return res.status(404).json({ message: 'No shipping data found' });
    }

    return res.json({
      metadata: shipping.metadata ? shipping.metadata[0] : null,
      data: shipping.data || null,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(422).json({ errors: formatZodError(error) });
    }
    return res.status(404).json({ message: error.message });
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getProduct(req, res, next) {
  try {
    const product = await ShippingMongo.findOne();
    if (!product) {
      return res.status(404).json({ message: 'Livraison introuvable' });
    }
    return res.json(product);
  } catch (error) {
    return next(error);
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
  getAllShipping,
  getProduct,
};
