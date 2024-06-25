const { verify } = require('@node-rs/argon2');
const dayjs = require('dayjs');
const jose = require('jose');
const authConfig = require('../config/auth.config');
const { sendForgotPasswordEmail } = require('../config/email.config');
const UserMongo = require('../models/mongo/user.mongo');
const { UsersSequelize, connection } = require('../models/sql');
const { Unauthorized } = require('http-errors');
const {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../schemas/auth.schema');

/**
 *
 * @type {import("express").RequestHandler}
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await UserMongo.findOne({ email });

    if (!user) {
      return res.sendStatus(401);
    }

    if (!user.isVerified) {
      return res.sendStatus(403);
    }

    const isValidPassword = await verify(user.password, password);

    if (!isValidPassword) {
      return res.sendStatus(401);
    }

    const now = dayjs();
    const issuedAt = now.unix();
    const accessTokenExpiredAt = now.add(60, 'minute').unix();

    const accessTokenSign = new jose.SignJWT({
      email: user.email,
    })
      .setSubject(user.id)
      .setIssuedAt(issuedAt)
      .setExpirationTime(accessTokenExpiredAt)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setNotBefore(issuedAt);

    const accessToken = await accessTokenSign.sign(
      authConfig.accessTokenSecret,
    );

    const refreshTokenExpiredAt = now.add(30, 'day').unix();

    const refreshTokenSign = new jose.SignJWT()
      .setSubject(user.id)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt(issuedAt)
      .setExpirationTime(refreshTokenExpiredAt)
      .setNotBefore(issuedAt);

    const refreshToken = await refreshTokenSign.sign(
      authConfig.refreshTokenSecret,
    );

    return res.json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 *
 * @type {import("express").RequestHandler}
 */
const confirm = async (req, res, next) => {
  try {
    const token = res.locals.token;

    const decoded = await jose.jwtVerify(
      token,
      authConfig.confirmationTokenSecret,
      {
        requiredClaims: ['sub'],
        maxTokenAge: '15 minutes',
      },
    );

    const nbUpdated = await UsersSequelize.update(
      {
        isVerified: true,
      },
      {
        where: {
          id: decoded.payload.sub,
        },
      },
    );

    if (nbUpdated === 0) {
      return res.sendStatus(401);
    }

    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
};

/**
 *
 * @type {import("express").RequestHandler}
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    const user = await UserMongo.findOne({ email });

    if (!user) {
      return res.sendStatus(204);
    }

    const now = dayjs();
    const issuedAt = now.unix();

    const forgotPasswordTokenSign = new jose.SignJWT()
      .setSubject(user.id)
      .setIssuedAt(issuedAt)
      .setExpirationTime('15 minutes')
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setNotBefore(issuedAt);

    const forgotPasswordToken = await forgotPasswordTokenSign.sign(
      authConfig.forgotPasswordTokenSecret,
    );

    await sendForgotPasswordEmail(
      { email: user.email, fullname: user.fullname },
      forgotPasswordToken,
    );

    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
};

/**
 *
 * @type {import("express").RequestHandler}
 */
const resetPassword = async (req, res, next) => {
  try {
    const { password } = resetPasswordSchema.parse(req.body);
    const token = res.locals.token;

    const decoded = await jose.jwtVerify(
      token,
      authConfig.forgotPasswordTokenSecret,
      {
        requiredClaims: ['sub'],
        maxTokenAge: '15 minutes',
      },
    );

    const user = await UserMongo.findById(decoded.payload.sub);

    if (!user) {
      return res.sendStatus(401);
    }

    const result = await connection.transaction(async (t) => {
      const [nbUpdated, updatedUsers] = await UsersSequelize.update(
        {
          password,
        },
        {
          where: {
            id: user._id,
          },
          returning: true,
          individualHooks: true,
        },
      );

      if (nbUpdated === 0) {
        // throw instead of directly return because of the transaction
        throw new Unauthorized();
      }

      throw new Error('test');
    });

    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
};

module.exports = { confirm, login, forgotPassword, resetPassword };
