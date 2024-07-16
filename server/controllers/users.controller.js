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
const { NotFound } = require('http-errors');

const Users = sequelize.model('users');

/**
 * Créer un utilisateur
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function createUser(req, res, next) {
  try {
    const userCreationData = userCreateSchema.parse(req.body);
    if (!req.user || req.user.role !== 'admin') {
      userCreationData.role = 'user';
      userCreationData.isVerified = false;
    }

    const newUser = await sequelize.transaction(async (t) => {
      const data = await Users.create(userCreationData, {
        transaction: t,
        include: ['addresses'],
      });

      const userMongo = data.toMongo();

      const userDoc = await UserMongo.create(userMongo);

      return {
        id: userDoc.id,
        fullname: userDoc.fullname,
        email: userDoc.email,
        addresses: userDoc.addresses,
      };
    });

    if (req?.user?.role !== 'admin') {
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
        metadata: [
          { $count: 'total' },
          {
            $set: {
              page,
              totalPages: { $ceil: { $divide: ['$total', pageSize] } },
              pageSize,
            },
          },
        ],
        items: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
      },
    });

    const [{ items, metadata }] = await UserMongo.aggregate(pipelineStages);

    return res.json({
      metadata: metadata[0] ?? {
        total: 0,
        page: 1,
        totalPages: 0,
        pageSize,
      },
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
    const userId = req.params.userId;

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
    const userId = req.params.userId;

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
    const userId = req.params.userId;
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

/**
 * Récupérer le nombre d'inscriptions d'utilisateurs par jour sur Mongo
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getUserRegistrations(req, res, next) {
  try {
    const registrations = await UserMongo.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    return res.status(200).json(
      registrations.map((entry) => ({
        date: entry._id,
        count: entry.count,
      })),
    );
  } catch (error) {
    return next(error);
  }
}

/**
 * Récupère le nombre total d'utilisateurs dans Mongo
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getUserCount(req, res, next) {
  try {
    const count = await UserMongo.countDocuments();
    return res.status(200).json({ count });
  } catch (error) {
    return next(error);
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getUser(req, res, next) {
  try {
    const user = await UserMongo.findById(req.params.id);

    if (user === null) {
      console.log('no user found');
      return res.sendStatus(404);
    }

    return res.json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getUserAddresses(req, res, next) {
  try {
    const user = await UserMongo.findById(req.params.id);

    if (user === null) {
      console.log('no user found');
      return res.sendStatus(404);
    }

    return res.json(user.addresses);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUserCount,
  createUser,
  getUsers,
  getUser,
  replaceUser,
  deleteUser,
  updateUser,
  getUserRegistrations,
  getUserRegistrations,
};