import * as jose from 'jose';
import authConfig from '../config/auth.config.js';
import InvalidTokenFormatError from '../errors/InvalidTokenFormatError.js';

/**
 *
 * @type {import("express").RequestHandler}
 */
const isAuthenticated = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      message: 'Veuillez vous connecter pour accéder à cette ressource',
    });
  }
  return next();
};

/**
 *
 * @type {import("express").RequestHandler}
 */
const isValidToken = async (req, res, next) => {
  try {
    const tokenParts = req.headers.authorization.split(' ');
    if (tokenParts.length !== 2) {
      throw new InvalidTokenFormatError(
        "Le token doit être au format 'Bearer <token>'",
      );
    }

    const [bearer, token] = tokenParts;

    if (bearer !== 'Bearer' || !token) {
      throw new InvalidTokenFormatError(
        "Le token doit être au format 'Bearer <token>'",
      );
    }

    const decodedToken = await jose.jwtVerify(
      token,
      authConfig.accessTokenSecret,
    );
    res.locals.user = decodedToken;

    return next();
  } catch (error) {
    if (error instanceof InvalidTokenFormatError) {
      return res.status(401).json({
        message: error.message,
      });
    }
    if (error instanceof jose.errors.JWTExpired) {
      return res.status(401).json({
        message: 'Token expiré',
      });
    } else if (error instanceof jose.errors.JOSEError) {
      return res.status(401).json({
        message: 'Token invalide',
      });
    }
  }
};

export { isAuthenticated, isValidToken };
