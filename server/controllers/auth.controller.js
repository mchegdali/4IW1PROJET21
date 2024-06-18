import * as jose from 'jose';
import { verify, hash } from '@node-rs/argon2';
import authConfig from '../config/auth.config.js';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';
import { ZodError } from 'zod';
import UserMongo from '../models/mongo/user.mongo.js';
import dayjs from 'dayjs';
import crypto from 'node:crypto';
import { sendConfirmationEmail } from '../config/email.config.js';

/**
 *
 * @type {import("express").RequestHandler}
 */
const login = async (req, res) => {
  try {
    const { email, password } = await loginSchema.parseAsync(req.body);

    const user = await UserMongo.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: 'Identifiants incorrects',
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message: "Votre compte n'est pas encore vérifié",
      });
    }

    const isValidPassword = await verify(user.password, password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Identifiants incorrects',
      });
    }

    const now = dayjs();
    const issuedAt = now.unix();
    const accessTokenExpiredAt = now.add(60, 'minute').unix();

    const accessTokenSign = new jose.SignJWT({
      email: user.email,
      role: user.role,
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

    const refreshTokenSign = new jose.SignJWT({
      sub: user.id,
    })
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
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: error.format(),
      });
    }

    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: 'Erreur interne',
    });
  }
};

/**
 *
 * @type {import("express").RequestHandler}
 */
const register = async (req, res) => {
  try {
    const { fullname, email, password } = await registerSchema.parseAsync(
      req.body,
    );

    const user = await UserMongo.exists({ email });

    if (user) {
      return res.status(400).json({
        message: 'Cet email est déjà utilisé',
      });
    }

    const newPassword = await hash(password, authConfig.hashOptions);

    const newUser = await UserMongo.create({
      _id: crypto.randomUUID(),
      fullname,
      email,
      password: newPassword,
      addresses: [],
      isVerified: false,
    });

    const now = dayjs();
    const issuedAt = now.unix();
    const confirmationTokenExpiredAt = now.add(15, 'minute').unix();

    const confirmationTokenSign = new jose.SignJWT({
      email: newUser.email,
      role: newUser.role,
    })
      .setSubject(newUser._id)
      .setIssuedAt(issuedAt)
      .setExpirationTime(confirmationTokenExpiredAt)
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
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        errors: error,
      });
    }

    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: 'Erreur interne',
    });
  }
};

/**
 *
 * @type {import("express").RequestHandler}
 */
const confirm = async (req, res) => {
  try {
    if (!req.query.token) {
      return res.status(401).json({
        message: 'Token invalide',
      });
    }
    const token = req.query.token;

    const decoded = await jose.jwtVerify(
      token,
      authConfig.confirmationTokenSecret,
    );

    const updateResult = await UserMongo.updateOne(
      { _id: decoded.payload.sub },
      {
        isVerified: true,
      },
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(401).json({
        message: 'Identifiants incorrects',
      });
    }

    return res.status(200).json({
      message:
        'Votre compte a été vérifié avec succès. Vous pouvez vous connecter.',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        errors: error,
      });
    }

    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: 'Erreur interne',
    });
  }
};

export { login, register, confirm };
