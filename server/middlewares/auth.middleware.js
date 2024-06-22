import * as jose from 'jose';
import authConfig from '../config/auth.config.js';

/**
 *
 * @type {import("express").RequestHandler}
 */
const validateAuthorizationHeader = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.sendStatus(401);
  }

  const tokenParts = req.headers.authorization.split(' ');
  if (tokenParts.length !== 2) {
    return res.sendStatus(401);
  }

  const [bearer, token] = tokenParts;

  if (bearer !== 'Bearer' || !token) {
    return res.sendStatus(401);
  }

  res.locals.token = token;

  return next();
};

/**
 * @description
 * Check if the token is valid.
 *
 * Use after `isValidAuthorization` middleware.
 * @type {import("express").RequestHandler}
 */
const validateAccessToken = async (req, res, next) => {
  const token = res.locals.token;
  try {
    const decodedToken = await jose.jwtVerify(
      token,
      authConfig.accessTokenSecret,
    );

    res.locals.user = {
      id: decodedToken.payload.sub,
      role: decodedToken.payload.role,
      email: decodedToken.payload.email,
    };

    return next();
  } catch (error) {
    if (error instanceof jose.errors.JOSEError) {
      return res.sendStatus(401);
    }
  }
};

/**
 *
 * @param {string[]} roles
 * @returns {import("express").RequestHandler}
 */
const validateRoles = (roles) => (req, res, next) => {
  if (!res.locals.user.role) {
    return res.sendStatus(401);
  }

  if (!roles.includes(res.locals.user.role)) {
    return res.sendStatus(403);
  }

  return next();
};

export { validateAccessToken, validateAuthorizationHeader, validateRoles };
