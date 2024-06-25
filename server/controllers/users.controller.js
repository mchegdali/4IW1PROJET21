const UserMongo = require('../models/mongo/user.mongo');
const { userCreateSchema, userQuerySchema } = require('../schemas/user.schema');
const { UsersSequelize } = require('../models/sql/');
const sequelize = require('../models/sql/db');
const dayjs = require('dayjs');
const jose = require('jose');
const authConfig = require('../config/auth.config');
const { sendConfirmationEmail } = require('../config/email.config');
const os = require('node:os');

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function createUser(req, res, next) {
  try {
    const userCreationData = userCreateSchema.parse(req.body);
    if (req.user.role !== 'admin') {
      userCreationData.role = 'user';
      userCreationData.isVerified = true;
    }

    const newUser = await sequelize.transaction(async (t) => {
      const data = await UsersSequelize.create(userCreationData, {
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

    if (req.user.role !== 'admin') {
      const now = dayjs();
      const issuedAt = now.unix();

      const confirmationTokenSign = new jose.SignJWT({
        email: newUser.email,
      })
        .setSubject(newUser._id)
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
    const { page, text, limit } = await userQuerySchema.parseAsync(req.query);
    const hostUrl = new URL(
      req.url,
      `${process.env.HOST ?? 'http://localhost:3000'}`,
    );

    hostUrl.searchParams.set('page', page);
    hostUrl.searchParams.set('text', text);
    hostUrl.searchParams.set('limit', limit);
    hostUrl.searchParams.sort();

    const nextUrl = new URL(
      req.url,
      `${process.env.HOST ?? 'http://localhost:3000'}`,
    );
    nextUrl.searchParams.set('page', page + 1);
    nextUrl.searchParams.set('text', text);
    nextUrl.searchParams.set('limit', limit);
    nextUrl.searchParams.sort();

    let prevUrl =
      page > 1
        ? new URL(req.url, `${process.env.HOST ?? 'http://localhost:3000'}`)
        : null;
    if (prevUrl) {
      prevUrl.searchParams.set('page', page - 1);
      prevUrl.searchParams.set('text', text);
      prevUrl.searchParams.set('limit', limit);
      prevUrl.searchParams.sort();
    }

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
        _links: [
          { $count: 'total' },
          { $addFields: { page } },
          { $addFields: { limit } },
          {
            $addFields: {
              totalPages: {
                $ceil: {
                  $divide: ['$total', '$limit'],
                },
              },
            },
          },
          {
            $addFields: {
              self: {
                href: hostUrl.href,
              },
              next: {
                href: {
                  $cond: {
                    if: {
                      $eq: ['$page', '$totalPages'],
                    },
                    then: null,
                    else: {
                      href: nextUrl.href,
                    },
                  },
                },
              },
              prev: {
                $cond: {
                  if: {
                    $gt: ['$page', 1],
                  },
                  then: null,
                  else: {
                    href: prevUrl?.href,
                  },
                },
              },
              last: {
                $function: {
                  args: ['$totalPages', hostUrl.href],
                  body: function (totalPages, hostUrl) {
                    // const url = hostUrl;
                    // url.searchParams.set('text', text);
                    // url.searchParams.set('limit', limit);
                    // url.searchParams.set('page', totalPages);
                    // url.searchParams.sort();
                    return {
                      href: hostUrl.replace(/page=\d+/, `page=${totalPages}`),
                    };
                  },
                  lang: 'js',
                },
              },
            },
          },
        ],
        items: [{ $skip: (page - 1) * limit }, { $limit: limit }],
      },
    });

    const [{ items, _links }] = await UserMongo.aggregate(pipelineStages);

    return res.json({
      // _links: users[0]._link[0],
      _links: _links ?? null,
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
async function updateUser(req, res, next) {
  try {
    const userCreationData = userCreateSchema.parse(req.body);
    if (req.user.role !== 'admin') {
      userCreationData.role = 'user';
      userCreationData.isVerified = true;
    }

    const newUser = await sequelize.transaction(async (t) => {
      const data = await UsersSequelize.create(userCreationData, {
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

    if (req.user.role !== 'admin') {
      const now = dayjs();
      const issuedAt = now.unix();

      const confirmationTokenSign = new jose.SignJWT({
        email: newUser.email,
      })
        .setSubject(newUser._id)
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

module.exports = {
  createUser,
  getUsers,
};
