import { DataTypes, QueryTypes } from 'sequelize';
import { zocker } from 'zocker';
import { productCreateSchema } from '../schemas/products.schema.js';
import ProductsCategoriesSequelize from '../models/sql/products-categories.sql.js';
import ProductMongo from '../models/mongo/products.js';
import ProductsSequelize from '../models/sql/products.sql.js';
import slugify from '@sindresorhus/slugify';

const mockProductCreateSchema = productCreateSchema.transform((p) => ({
  ...p,
  id: crypto.randomUUID(),
  slug: slugify(p.name),
}));

const zock = zocker(mockProductCreateSchema);

/**
 * @typedef { Object } MigrationParams
 * @property { string } name
 * @property { string } [path]
 * @property { Object } context
 * @property { import('sequelize').Sequelize } context.sequelize
 * @property { import('mongoose').Mongoose } context.mongoose
 */

/**
 *
 * @param {MigrationParams} params
 *
 */
export const up = async ({ context: { sequelize, mongoose } }) => {
  const queryInterface = sequelize.getQueryInterface();
  const productsCategories = await queryInterface.sequelize.query(
    'SELECT * FROM products_categories',
    {
      type: QueryTypes.SELECT,
      model: ProductsCategoriesSequelize,
      mapToModel: true,
    },
  );

  const products = [];

  for (let i = 0; i < productsCategories.length; i++) {
    const category = productsCategories[i].getDataValue('id');
    products.push(
      ...zock
        .supply(productCreateSchema.shape.categoryId, category)
        .generateMany(10),
    );
  }

  const createdProducts = await queryInterface.bulkInsert(
    'products',
    products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description,
      category_id: p.categoryId,
      image: p.image,
      price: p.price,
    })),
    {
      fieldMap: {
        id: '_id',
      },
      mapToModel: true,
      model: ProductsSequelize,
      include: [ProductsCategoriesSequelize],
    },
  );

  console.log(createdProducts);
  // await ProductMongo.insertMany(
  //   products.map((p) => ({
  //     _id: p.id,
  //     slug: p.slug,
  //     name: p.name,
  //     description: p.description,
  //     category: p.categoryId,
  //     image: p.image,
  //     price: p.price,
  //   })),
  // );
};

/**
 *
 * @param {MigrationParams} params
 *
 */
export const down = async ({ context: { sequelize, mongoose } }) => {
  const queryInterface = sequelize.getQueryInterface();
  await queryInterface.bulkDelete('products', null, {});
};
