import UserMongo from '../models/mongo/user.mongo.js';
import {
  userCreateSchema,
  userQuerySchema,
  userSchema,
  userUpdateSchema,
} from '../schemas/user.schema.js';
import UsersSequelize from '../models/sql/users.sql.js';
import { sequelize } from '../sequelize.js';
import validator from 'validator';
import httpErrors from 'http-errors';
import { hash } from '@node-rs/argon2';
import authConfig from '../config/auth.config.js';
const { NotFound } = httpErrors;

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
export async function createUser(req, res, next) {
  try {
    const userRequestBody = await userCreateSchema.parseAsync(req.body);
    userRequestBody.password = await hash(
      userRequestBody.password,
      authConfig.hashOptions,
    );

    const result = await sequelize.transaction(async (t) => {
      const data = await UsersSequelize.create(userRequestBody, {
        transaction: t,
        include: ['addresses'],
      });

      const userMongo = {
        _id: data.getDataValue('id'),
        fullname: data.getDataValue('fullname'),
        email: data.getDataValue('email'),
        password: data.getDataValue('password'),
        role: data.getDataValue('role'),
        isVerified: data.getDataValue('isVerified'),
        passwordValidUntil: data.getDataValue('passwordValidUntil'),
        addresses: [],
      };

      const userDoc = await UserMongo.create(userMongo);

      return {
        _id: userDoc._id.toString(),
        fullname: userDoc.fullname,
        email: userDoc.email,
        addresses: userDoc.addresses,
      };
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
export async function getUsers(req, res, next) {
  try {
    const { page, text, limit } = await userQuerySchema.parseAsync(req.query);

    /**
     * @type {import('mongoose').PipelineStage[]  }
     */
    const pipelineStages = [];
    /**
     * @type {import('mongoose').PipelineStage  }
     */
    let textMatchStage;

    /**
     * @type {import('mongoose').PipelineStage  }
     */
    let sortStage;

    if (text) {
      textMatchStage = {
        $match: {
          $text: {
            $search: text,
            $diacriticSensitive: false,
            $caseSensitive: false,
          },
        },
      };
      sortStage = {
        $sort: { score: { $meta: 'textScore' } },
      };
    }

    if (textMatchStage) {
      pipelineStages.push(textMatchStage);
    }

    if (sortStage) {
      pipelineStages.push(sortStage);
    }

    pipelineStages.push(
      { $skip: (page - 1) * limit },
      { $project: { _id: 1, fullname: 1, email: 1, role: 1, addresses: 1 } },
      {
        $facet: {
          metadata: [
            { $count: 'total' },
            {
              $addFields: {
                page,
                totalPages: { $ceil: { $divide: ['$total', limit] } },
              },
            },
          ],
          data: [],
        },
      },
    );

    console.log(JSON.stringify(pipelineStages));

    const users = await UserMongo.aggregate(pipelineStages);

    return res.json({
      metadata: users[0].metadata[0],
      data: users[0].data,
    });
  } catch (error) {
    return next(error);
  }
}

// /**
//  *
//  * @type {import('express').RequestHandler}
//  * @returns
//  */
// export async function getProduct(req, res, next) {
//   try {
//     const isUUID = validator.isUUID(req.params.product);

//     const filter = {
//       [isUUID ? '_id' : 'slug']: req.params.product,
//     };

//     const product = await UserMongo.findOne(filter);
//     if (!product) {
//       return res.status(404).json({ message: 'Produit introuvable' });
//     }
//     return res.json(product);
//   } catch (error) {
//     return next(error);
//   }
// }

// /**
//  *
//  * @type {import('express').RequestHandler}
//  * @returns
//  */
// export async function getRelatedProducts(req, res, next) {
//   try {
//     const isUUID = validator.isUUID(req.params.product);

//     const filter = {
//       [isUUID ? '_id' : 'slug']: req.params.product,
//     };

//     const product = await UserMongo.findOne(filter);
//     if (!product) {
//       return res.status(404).json({ message: 'Produit introuvable' });
//     }

//     const relatedProducts = await UserMongo.find({
//       category: product.category,
//       _id: { $ne: product._id },
//     }).limit(5);

//     return res.status(200).json(relatedProducts);
//   } catch (error) {
//     return next(error);
//   }
// }

// /**
//  *
//  * @type {import('express').RequestHandler}
//  * @returns
//  */
// export async function updateProduct(req, res, next) {
//   try {
//     const isUUID = validator.isUUID(req.params.product);
//     const sqlWhere = {
//       [isUUID ? 'id' : 'slug']: req.params.product,
//     };
//     const mongoWhere = {
//       [isUUID ? '_id' : 'slug']: req.params.product,
//     };

//     const productUpdateBody = await productUpdateSchema.parseAsync(req.body);
//     const updatedKeys = Object.keys(productUpdateBody);

//     const result = await sequelize.transaction(async (t) => {
//       const [affectedRowsCount, affectedRows] = await UsersSequelize.update(
//         productUpdateBody,
//         {
//           where: sqlWhere,
//           limit: 1,
//           transaction: t,
//           returning: true,
//         },
//       );

//       if (affectedRowsCount === 0) {
//         throw new NotFound('Produit introuvable');
//       }

//       const product = await UsersSequelize.scope('toMongo').findByPk(
//         affectedRows[0].getDataValue('id'),
//         {
//           transaction: t,
//         },
//       );

//       const productMongo = {};

//       for (const key of updatedKeys) {
//         productMongo[key] = product.getDataValue(key);
//       }

//       const replaceResult = await UserMongo.findOneAndUpdate(
//         mongoWhere,
//         productMongo,
//         {
//           new: true,
//         },
//       );

//       if (!replaceResult) {
//         throw new NotFound('Produit introuvable');
//       }

//       return replaceResult;
//     });

//     return res.status(200).json(result);
//   } catch (error) {
//     return next(error);
//   }
// }

// /**
//  *
//  * @type {import('express').RequestHandler}
//  * @returns
//  */
// export async function deleteProduct(req, res, next) {
//   try {
//     const isUUID = validator.isUUID(req.params.product);

//     const sqlWhere = {
//       [isUUID ? 'id' : 'slug']: req.params.product,
//     };
//     const mongoWhere = {
//       [isUUID ? '_id' : 'slug']: req.params.product,
//     };

//     const [deletedCountSql, deletedCountMongo] = await Promise.all([
//       UsersSequelize.destroy({ where: sqlWhere }),
//       UserMongo.deleteOne(mongoWhere),
//     ]);

//     if (deletedCountSql === 0 && deletedCountMongo.deletedCount === 0) {
//       return res.status(404).json({ message: 'Produit introuvable' });
//     }

//     return res.sendStatus(204);
//   } catch (error) {
//     return next(error);
//   }
// }
