const jose = require('jose');
const authConfig = require('../config/auth.config');
const sequelize = require('../models/sql');
const Users = sequelize.model('users');

/**
 *
 * @type {import("express").RequestHandler}
 */
const checkAuthHeader = (req, res, next) => {
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
 * Use after `checkAuthHeader` middleware.
 * @type {import("express").RequestHandler}
 */
const checkAccessToken = async (req, res, next) => {
  try {
    const token = res.locals.token;
    const decodedToken = await jose.jwtVerify(
      token,
      authConfig.accessTokenSecret,
    );

    const user = await Users.findByPk(decodedToken.payload.sub);

    if (!user) {
      return res.sendStatus(401);
    }

    req.user = user;

    return next();
  } catch (error) {
    if (error instanceof jose.errors.JOSEError) {
      return res.sendStatus(401);
    }
  }
};

/**
 *
 * @param {"admin"|"accountant"|"user"} role
 * @returns {import("express").RequestHandler}
 */
const checkRole = (role) => (req, res, next) => {
  if (!req.user.role) {
    return res.sendStatus(403);
  }

  const isAdmin = req.user.role === 'admin';
  const isAccountant = req.user.role === 'accountant';
  const isUser = req.user.role === 'user';

  if (!isAdmin && !isAccountant && !isUser) {
    return res.sendStatus(403);
  }

  if (role === 'admin' && !isAdmin) {
    return res.sendStatus(403);
  } else if (role === 'accountant' && !(isAccountant || isAdmin)) {
    return res.sendStatus(403);
  } else if (role === 'user' && !(isUser || isAccountant || isAdmin)) {
    return res.sendStatus(403);
  }

  console.groupEnd();

  return next();
};

module.exports = {
  checkAccessToken,
  checkAuthHeader,
  checkRole,
};
