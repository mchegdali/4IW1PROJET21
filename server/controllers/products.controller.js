import { ZodError } from 'zod';
import ProductMongo from '../models/mongo/products.js';
import {
  productCreateSchema,
  productQuerySchema,
} from '../schemas/products.schema.js';
import formatZodError from '../utils/format-zod-error.js';
import ProductsSequelize from '../models/sql/products.sql.js';
import { ValidationError } from 'sequelize';
import { sequelize } from '../sequelize.js';
import validator from 'validator';

const PAGE_SIZE = 10;

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
export async function createProduct(req, res) {
  try {
    const result = await sequelize.transaction(async (t) => {
      const productCreateBody = await productCreateSchema.parseAsync(req.body);

      const data = await ProductsSequelize.create(productCreateBody, {
        transaction: t,
      });

      const newData = await ProductsSequelize.scope('toMongo').findByPk(
        data.id,
        {
          transaction: t,
        },
      );

      const product = {
        _id: newData.id,
        name: newData.name,
        description: newData.description,
        category: {
          id: newData.category.id,
          name: newData.category.name,
          slug: newData.category.slug,
        },
        image: newData.image,
        price: newData.price,
        slug: newData.slug,
      };

      const productDoc = await ProductMongo.create(product);

      return productDoc;
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
export async function getProducts(req, res) {
  try {
    const category = req.params.category;
    console.log(category);
    const { page, text } = await productQuerySchema.parseAsync(req.query);

    if (text) {
      const andFilter = [
        {
          $text: {
            $search: text,
            $diacriticSensitive: false,
            $caseSensitive: false,
            $language: 'fr',
          },
        },
      ];

      if (category) {
        andFilter.push({
          category: {
            $eq: category,
          },
        });
      }
      const products = await ProductMongo.find(
        {
          $and: andFilter,
        },
        {
          score: { $meta: 'textScore' },
        },
      )
        .sort({
          score: { $meta: 'textScore' },
        })
        .select({
          score: 0,
        });

      return res.json(products);
    } else {
      const dataFilter = [];

      if (category) {
        dataFilter.push({
          $match: { $and: [{ category: { $eq: category } }] },
        });
      }
      dataFilter.push(
        { $skip: (page - 1) * PAGE_SIZE },
        { $limit: PAGE_SIZE },
        {
          $set: {
            price: { $toString: '$price' },
          },
        },
      );

      const products = await ProductMongo.aggregate([
        {
          $facet: {
            metadata: [
              { $count: 'total' },
              {
                $addFields: {
                  page,
                  totalPages: {
                    $ceil: { $divide: ['$total', PAGE_SIZE] },
                  },
                },
              },
            ],
            data: dataFilter,
          },
        },
      ]);

      return res.json({
        metadata: products[0].metadata[0],
        data: products[0].data,
      });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        errors: formatZodError(error),
      });
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
    const isUUID = validator.isUUID(req.params.product);

    const filter = {
      [isUUID ? '_id' : 'slug']: req.params.product,
    };

    const product = await ProductMongo.findOne(filter);
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
