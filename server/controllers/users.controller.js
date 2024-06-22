import UserMongo from '../models/mongo/user.mongo.js';
import { userCreateSchema, userQuerySchema } from '../schemas/user.schema.js';
import UsersSequelize from '../models/sql/users.sql.js';
import sequelize from '../models/sql/db.js';

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
export async function createUser(req, res, next) {
  try {
    const userRequestBody = await userCreateSchema.parseAsync(req.body);

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

    pipelineStages.push(
      { $skip: (page - 1) * limit },
      { $project: { _id: 1, fullname: 1, email: 1, role: 1, addresses: 1 } },
      {
        $facet: {
          metadata: [
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

    if (sortStage) {
      pipelineStages.push(sortStage);
    }

    const users = await UserMongo.aggregate(pipelineStages);

    return res.json({
      links: users[0].metadata[0],
      items: users[0].data,
    });
  } catch (error) {
    return next(error);
  }
}
