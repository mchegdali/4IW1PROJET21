import { ZodError } from 'zod';
import ShippingMongo from '../models/mongo/shipping.js';
import {shippingCreateSchema} from '../schemas/shipping.schema.js';
import formatZodError from '../utils/format-zod-error.js';
import ShippingSequelize from '../models/sql/shipping.sql.js';
import { ValidationError } from 'sequelize';
import { sequelize } from '../sequelize.js';


/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
export async function createShipping(req, res) {
  try {
    const result = await sequelize.transaction(async (t) => {
      const shippingCreateBody = await shippingCreateSchema.parseAsync(req.body);

      const newData = await ShippingSequelize.create(shippingCreateBody, {
        transaction: t,
      });

      // const newData = await ShippingSequelize.scope('toMongo').findByPk(
      //   data.id,
      //   {
      //     transaction: t,
      //   },
      // );

      const shipping = {
        id: newData.id,
        fullname: newData.fullname,
        city: newData.city,
        emailCustomer: newData.emailCustomer,
        street: newData.street,
        zipCode: newData.zipCode,
        phone: newData.phone
      };

      const shippingDoc = await ShippingMongo.create(shipping);

      return shippingDoc;
    });

    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ errors: error.errors });
    }
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: formatZodError(error) });
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
export async function getShipping(req, res) {
  try {
    const shipping = req.params.shipping;
    console.log(shipping);
  }catch(error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ errors: error.errors });
    }
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: formatZodError(error) });
    }

    console.error(error);
    res.status(500).json({ message: error.message });
  }
}
export async function getAllShipping(req,res) {
  try {
    const shipping = await ShippingMongo.find({});
    
    if (!shipping) {
      return res.status(404).json({ message: 'No shipping data found' });
    }

    return res.json({
      metadata: shipping.metadata ? shipping.metadata[0] : null,
      data: shipping.data || null,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: formatZodError(error) });
    }
    return res.status(400).json({ message: error.message });
  }

}



/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
export async function getProduct(req, res) {
  try {

    const product = await ShippingMongo.findOne();
    if (!product) {
      return res.status(404).json({ message: 'Livraison introuvable' });
    }
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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