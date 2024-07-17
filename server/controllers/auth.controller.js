const { verify } = require('@node-rs/argon2');
const dayjs = require('dayjs');
const jose = require('jose');
const authConfig = require('../config/auth.config');
const {
  sendForgotPasswordEmail,
  sendConfirmationEmail,
} = require('../config/email.config');
const sequelize = require('../models/sql');
const {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  resendConfirmationEmailSchema,
} = require('../schemas/auth.schema');
const UserMongo = require('../models/mongo/user.mongo');
const generateAccessToken = require('../utils/generate-access-token');
const generateRefreshToken = require('../utils/generate-refresh-token');

const Users = sequelize.model('users');

/**
 *
 * @type {import("express").RequestHandler}
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await UserMongo.findOne({
      email,
    });

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

    const { issuedAt, accessToken } = await generateAccessToken(user);

    const refreshToken = await generateRefreshToken(user, issuedAt);

    return res.json({
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
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
const refreshToken = async (req, res, next) => {
  try {
    const { data, success } = refreshTokenSchema.safeParse(req.body);
    const { refreshToken } = data;

    if (!success) {
      return res.sendStatus(401);
    }

    const decodedToken = await jose.jwtVerify(
      refreshToken,
      authConfig.refreshTokenSecret,
    );
    const user = await Users.findByPk(decodedToken.payload.sub);

    if (!user) {
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

    return res.send(accessToken);
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
    const token = req.body.token;

    if (!token || typeof token !== 'string') {
      return res.sendStatus(401);
    }

    const decoded = await jose.jwtVerify(
      token,
      authConfig.confirmationTokenSecret,
      {
        requiredClaims: ['sub'],
        maxTokenAge: '15 minutes',
      },
    );

    const [nbUpdated, updateResult] = await Promise.all([
      Users.update(
        {
          isVerified: true,
        },
        {
          where: {
            id: decoded.payload.sub,
          },
        },
      ),
      UserMongo.updateOne({ _id: decoded.payload.sub }, { isVerified: true }),
    ]);

    if (nbUpdated === 0 || updateResult.modifiedCount === 0) {
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

    const user = await Users.findOne({
      where: {
        email,
      },
    });

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
    const user = req.user;

    await sequelize.transaction(async (t) => {
      await req.user.update(
        {
          password,
        },
        {
          where: {
            id: user.id,
          },
          returning: true,
          individualHooks: true,
          transaction: t,
        },
      );
    });

    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
};

/**
 *
 * @type {import("express").RequestHandler}
 */
const resendConfirmationEmail = async (req, res, next) => {
  try {
    const { email } = resendConfirmationEmailSchema.parse(req.body);

    const user = await UserMongo.findOne({
      email,
    });

    if (!user) {
      return res.sendStatus(204);
    }

    const now = dayjs();
    const issuedAt = now.unix();

    const confirmationTokenSign = new jose.SignJWT({
      email: user.email,
    })
      .setSubject(user.id)
      .setIssuedAt(issuedAt)
      .setExpirationTime('15 minutes')
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setNotBefore(issuedAt);

    const confirmationToken = await confirmationTokenSign.sign(
      authConfig.confirmationTokenSecret,
    );

    await sendConfirmationEmail(
      { email: user.email, fullname: user.fullname },
      confirmationToken,
    );

    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  confirm,
  login,
  forgotPassword,
  resetPassword,
  refreshToken,
  resendConfirmationEmail,
};
