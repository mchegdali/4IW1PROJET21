const jose = require('jose');
const UserMongo = require('../models/mongo/user.mongo');

/**
 * @description
 * Check if the token is valid.
 *
 * @returns {import("express").RequestHandler}
 */
const checkAuth = (secret) => async (req, res, next) => {
  try {
    const tokenParts = req.headers.authorization.split(' ');
    if (tokenParts.length !== 2) {
      return res.sendStatus(401);
    }

    const [bearer, token] = tokenParts;

    if (bearer !== 'Bearer' || !token) {
      return res.sendStatus(401);
    }

    const decodedToken = await jose.jwtVerify(token, secret);
    const user = await UserMongo.findById(decodedToken.payload.sub);

    if (!user) {
      return res.sendStatus(401);
    }

    res.locals.token = token;
    req.user = user;

    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 *
 * @param {("admin"|"accountant"|"user")[]} allowedRoles
 * @returns {import("express").RequestHandler}
 */
const checkRole =
  (allowedRoles = ['admin']) =>
  (req, res, next) => {
    if (!req.user || !req.user.isVerified) {
      return res.sendStatus(403);
    }

    const isAdmin = req.user.role === 'admin';
    const isAccountant = req.user.role === 'accountant' || isAdmin;
    const isUser = req.user.role === 'user' || isAccountant;

    if (!isAdmin && !isAccountant && !isUser) {
      return res.sendStatus(403);
    }

    if (allowedRoles.includes('user') && !isUser) {
      return res.sendStatus(403);
    } else if (allowedRoles.includes('accountant') && !isAccountant) {
      return res.sendStatus(403);
    } else if (allowedRoles.includes('admin') && !isAdmin) {
      return res.sendStatus(403);
    }

    return next();
  };

module.exports = {
  checkAuth,
  checkRole,
};
