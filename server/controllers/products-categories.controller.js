import ProductMongo from '../models/products/products.mongoose.js';
import {
  productCreateSchema,
  productQuerySchema,
} from '../schemas/products.schema.js';
import formatZodError from '../utils/format-zod-error.js';
import ProductsSequelize from '../models/products/products.sequelize.js';
import { ZodError } from 'zod';

const PAGE_SIZE = 10;

async function createProductCategory(req, res) {
  try {
    const productCreateBody = await pro.parseAsync(req.body);
    const data = await ProductsSequelize.create(productCreateBody);

    console.log(data);
    // // denormalize the data
    // const product = {
    //   _id: data.id,
    //   title: data.title,
    //   description: data.description,
    //   category: data.category,
    //   image: data.image,
    //   price: data.price,
    // };

    // // create a product in MongoDB
    // const productDoc = new ProductMongo(product);
    // const createdProduct = await productDoc.save();
    return res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns
 */
async function getProducts(req, res) {
  try {
    const { page, text } = await productQuerySchema.parseAsync(req.query);

    if (text) {
      const products = await ProductMongo.find(
        {
          $text: {
            $search: text,
          },
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
            data: [
              { $skip: (page - 1) * PAGE_SIZE },
              { $limit: PAGE_SIZE },
              {
                $set: {
                  price: { $toString: '$price' },
                },
              },
            ],
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
 * @param {import('express').Request<{id: string}>} req
 * @param {import('express').Response} res
 * @returns
 */
async function getProduct(req, res) {
  try {
    const product = await ProductMongo.findById(req.params.id);
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

const productsController = { getProducts, getProduct };
export default productsController;
