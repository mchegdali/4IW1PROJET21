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
      const user = await Users.create(userCreationData, {
        transaction: t,
        include: ['addresses'],
      });

      return user;
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
    console.log('Received query:', req.query);
    const { page, text, pageSize, sortField, sortOrder } = userQuerySchema.parse(req.query);

    /**
     * @type {import('mongoose').PipelineStage[]  }
     */
    const pipelineStages = [];

    if (text && text.length >= 3) {
      pipelineStages.push(
        {
          $match: {
            $or: [
              { _id: { $regex: text, $options: 'i' } },
              { fullname: { $regex: text, $options: 'i' } },
              { email: { $regex: text, $options: 'i' } },
              { 'addresses.city': { $regex: text, $options: 'i' } }
            ]
          },
        }
      );
    }

    if (sortField && sortOrder) {
      const sortStage = {};
      const field = sortField === 'id' ? '_id' : sortField;
      sortStage[field] = sortOrder === 'asc' ? 1 : -1;
      pipelineStages.push({ $sort: sortStage });
    }

    pipelineStages.push(
      {
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
      },
    );

    const [result] = await UserMongo.aggregate(pipelineStages);
    const items = result.items ?? [];
    const metadata = result.metadata[0] ?? {
      total: 0,
      page: 1,
      totalPages: 0,
      pageSize,
    };

    return res.json({ metadata, items });
  } catch (error) {
    console.error('Error in getUsers:', error);
    next(error);
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
        individualHooks: true,
      });

      if (nbUpdated === 0) {
        throw new NotFound();
      }

      return users[0];
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

    if (nbDeleted === 0) {
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
    const user = await UserMongo.findById(req.params.userId, {
      password: 0,
    });

    if (user === null) {
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
    const user = await UserMongo.findById(req.params.userId);

    if (user === null) {
      return res.sendStatus(404);
    }

    return res.json(user.addresses);
  } catch (error) {
    return next(error);
  }
}

/**
 * Récupérer le nombre d'inscriptions d'utilisateurs par mois sur les 12 derniers mois sur Mongo
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getUserRegistrationsLast12Months(req, res, next) {
  try {
    const lastYear = dayjs().subtract(12, 'months').toDate();
    const registrations = await UserMongo.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
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
 * Récupérer le top 4 des produits les plus vendus et regrouper les autres produits dans "Autres"
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getTopProducts(req, res, next) {
  try {
    const topProducts = await UserMongo.aggregate([
      { $unwind: '$basket' },
      {
        $group: {
          _id: '$basket._id',
          name: { $first: '$basket.name' },
          totalSold: { $sum: 1 },
          price: { $first: '$basket.price' },
        },
      },
      { $sort: { totalSold: -1 } },
    ]);

    const totalSales = topProducts.reduce(
      (acc, product) => acc + product.totalSold,
      0,
    );

    const topProductsWithPercentage = topProducts.map((product) => ({
      ...product,
      percentage: ((product.totalSold / totalSales) * 100).toFixed(2),
    }));

    const top4Products = topProductsWithPercentage.slice(0, 4);
    const otherProducts = topProductsWithPercentage.slice(4);

    const othersTotalSold = otherProducts.reduce(
      (acc, product) => acc + product.totalSold,
      0,
    );
    const othersPercentage = ((othersTotalSold / totalSales) * 100).toFixed(2);

    if (othersTotalSold > 0) {
      top4Products.push({
        _id: 'others',
        name: 'Autres',
        totalSold: othersTotalSold,
        price: null,
        percentage: othersPercentage,
      });
    }

    return res.status(200).json(top4Products);
  } catch (error) {
    return next(error);
  }
}

/**
 * Récupérer les idS des users
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getUsersIds(req, res, next) {
  try {
    const userIds = await UserMongo.find({}, '_id'); // Récupérer uniquement les identifiants des utilisateurs
    res.status(200).json({ items: userIds });
  } catch (error) {
    next(error); // Gestion des erreurs
  }
}

/**
 * Récupérer les informations des utilisateurs par leurs identifiants
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getUsersByIds(req, res, next) {
  try {
    const userIds = req.body.ids;

    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ message: 'Invalid request, ids must be an array.' });
    }

    const users = await UserMongo.find({ _id: { $in: userIds } }, {
      password: 0,
    });

    return res.json(users);
  } catch (error) {
    next(error);
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
  getUserAddresses,
  getUserRegistrations,
  getUserRegistrationsLast12Months,
  getTopProducts,
  getUsersIds,
  getUsersByIds
};
