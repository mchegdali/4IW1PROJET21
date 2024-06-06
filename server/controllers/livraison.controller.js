import { ZodError } from 'zod';
import LivraisonMongo from '../models/mongo/livraison.js';
import {
  livraisonCreateSchema,
  livraisonQuerySchema,
} from '../schemas/livraison.schema.js';
import formatZodError from '../utils/format-zod-error.js';
import LivraisonSequelize from '../models/sql/livraison.sql.js';
import { ValidationError } from 'sequelize';
import { sequelize } from '../sequelize.js';
import validator from 'validator';

const PAGE_SIZE = 10;

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
export async function createLivraison(req, res) {
  try {
    const result = await sequelize.transaction(async (t) => {
      const productCreateBody = await livraisonCreateSchema.parseAsync(req.body);

      const data = await LivraisonSequelize.create(productCreateBody, {
        transaction: t,
      });

      const newData = await LivraisonSequelize.scope('toMongo').findByPk(
        data.id,
        {
          transaction: t,
        },
      );

      const livraison = {
        _id: newData.id,
        emailCustomer: newData.emailCustomer,
        country: newData.country,
        street: newData.street,
        zipCode: newData.zipCode,
        price: newData.price,
        
      };

      const livraisonDoc = await LivraisonMongo.create(livraison);

      return livraisonDoc;
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
export async function getLivraison(req, res) {
  try {
    const livraison = req.params.livraison;
    console.log(livraison);
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



/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
export async function getProduct(req, res) {
  try {

    const product = await LivraisonMongo.findOne();
    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable' });
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