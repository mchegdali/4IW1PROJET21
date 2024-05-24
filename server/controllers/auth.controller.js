import * as jose from 'jose';
import { hashSync, verify } from '@node-rs/argon2';
import authConfig from '../config/auth.config.js';
import { loginSchema } from '../schemas/auth.schema.js';
import { ZodError } from 'zod';

const users = [
  {
    id: crypto.randomUUID(),
    email: 'admin@admin.fr',
    password: hashSync('password', authConfig.hashOptions),
    role: 'admin',
  },
];

/**
 *
 * @type {import("express").RequestHandler}
 */
const login = async (req, res) => {
  try {
    const { email, password } = await loginSchema.parseAsync(req.body);

    const user = users.find((user) => user.email === email);

    if (!user) {
      return res.status(401).json({
        message: 'Identifiants incorrects',
      });
    }

    const isValidPassword = await verify(user.password, password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Identifiants incorrects',
      });
    }

    const accessTokenSign = new jose.SignJWT({
      sub: user.id,
      email: user.email,
      role: user.role,
    })
      .setIssuedAt()
      .setExpirationTime('1h')
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setNotBefore(new Date());

    const accessToken = await accessTokenSign.sign(
      authConfig.accessTokenSecret,
    );

    const refreshTokenSign = new jose.SignJWT({
      sub: user.id,
      email: user.email,
    })
      .setIssuedAt()
      .setExpirationTime('30d')
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setNotBefore(new Date());

    const refreshToken = await refreshTokenSign.sign(
      authConfig.refreshTokenSecret,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
    });

    return res.json({
      accessToken,
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
const refreshToken = async (req, res) => {
  try {
  } catch (error) {}
};

const authController = { login };

export default authController;
