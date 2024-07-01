const UserMongo = require('../models/mongo/user.mongo');
const {
  userCreateSchema,
  userQuerySchema,
  userUpdateSchema,
} = require('../schemas/user.schema');
const sequelize = require('../models/sql');
const dayjs = require('dayjs');
const jose = require('jose');
const authConfig = require('../config/auth.config');
const { sendConfirmationEmail } = require('../config/email.config');
const { getPaginationLinks } = require('../utils/get-pagination-links');
const { NotFound } = require('http-errors');

const Users = sequelize.model('users');

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function createUser(req, res, next) {
  try {
    const userCreationData = userCreateSchema.parse(req.body);
    if (!req.user || req.user.role !== 'admin') {
      userCreationData.role = 'user';
      userCreationData.isVerified = true;
    }

    const newUser = await sequelize.transaction(async (t) => {
      const data = await Users.create(userCreationData, {
        transaction: t,
        include: ['addresses'],
      });

      const userMongo = await data.toMongo();

      const userDoc = await UserMongo.create(userMongo);

      return {
        id: userDoc.id,
        fullname: userDoc.fullname,
        email: userDoc.email,
        addresses: userDoc.addresses,
      };
    });

    if (req.user.role !== 'admin') {
      const now = dayjs();
      const issuedAt = now.unix();

      const confirmationTokenSign = new jose.SignJWT({
        email: newUser.email,
      })
        .setSubject(newUser.id)
        .setIssuedAt(issuedAt)
        .setExpirationTime('15 minutes')
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setNotBefore(issuedAt);

      const confirmationToken = await confirmationTokenSign.sign(
        authConfig.confirmationTokenSecret,
      );

      await sendConfirmationEmail(
        { email: newUser.email, fullname: newUser.fullname },
        confirmationToken,
      );

      return res.sendStatus(201);
    }

    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error.name);

    return next(error);
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getUsers(req, res, next) {
  try {
    const { page, text, pageSize } = userQuerySchema.parse(req.query);

    /**
     * @type {import('mongoose').PipelineStage[]  }
     */
    const pipelineStages = [];

    if (text) {
      pipelineStages.push(
        {
          $match: {
            $text: {
              $search: text,
              $diacriticSensitive: false,
              $caseSensitive: false,
            },
          },
        },
        {
          $sort: { score: { $meta: 'textScore' } },
        },
      );
    }

    pipelineStages.push({
      $facet: {
        metadata: [{ $count: 'total' }],
        items: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
      },
    });

    const [{ items, metadata }] = await UserMongo.aggregate(pipelineStages);

    const _links = getPaginationLinks(req.url, page, text, pageSize, metadata);

    return res.json({
      _links,
      items: items ?? [],
    });
  } catch (error) {
    return next(error);
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function replaceUser(req, res, next) {
  try {
    const userId = req.params.id;

    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.sendStatus(403);
    }

    const body = userCreateSchema.parse(req.body);
    if (req.user.role !== 'admin') {
      body.role = 'user';
      body.isVerified = true;
    }

    const user = await sequelize.transaction(async (t) => {
      const [data] = await Users.upsert(
        { ...body, id: userId },
        {
          validate: true,
          transaction: t,
          include: ['addresses'],
          returning: true,
        },
      );

      const userMongo = data.toMongo();

      await UserMongo.updateOne(
        {
          _id: userId,
        },
        userMongo,
        {
          upsert: true,
          setDefaultsOnInsert: true,
        },
      );

      return data;
    });

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function updateUser(req, res, next) {
  try {
    const userId = req.params.id;

    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.sendStatus(403);
    }

    const userUpdateData = userUpdateSchema.parse(req.body);

    if (req.user.role !== 'admin') {
      userUpdateData.role = undefined;
      userUpdateData.isVerified = undefined;
    }

    const newUser = await sequelize.transaction(async (t) => {
      const [nbUpdated, users] = await Users.update(userUpdateData, {
        where: {
          id: userId,
        },
        limit: 1,
        validate: true,
        transaction: t,
        include: ['addresses'],
        returning: true,
      });

      if (nbUpdated === 0) {
        throw new NotFound();
      }

      const userMongo = users[0].toMongo();

      const updateResult = await UserMongo.updateOne(
        {
          _id: userId,
        },
        userMongo,
      );

      if (updateResult.matchedCount === 0) {
        throw new NotFound();
      }
    });

    return res.status(200).json(newUser);
  } catch (error) {
    return next(error);
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function deleteUser(req, res, next) {
  try {
    const userId = req.params.id;
    const nbDeleted = await Users.destroy({ where: { id: userId } });
    const { deletedCount } = await UserMongo.deleteOne({ _id: userId });

    if (nbDeleted === 0 || deletedCount === 0) {
      return res.sendStatus(404);
    }

    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createUser,
  getUsers,
  replaceUser,
  deleteUser,
  updateUser,
};