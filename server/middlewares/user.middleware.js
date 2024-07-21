const authConfig = require('../config/auth.config');
const jose = require('jose');
const UserMongo = require('../models/mongo/user.mongo');

/**
 *
 * @type {import("express").RequestHandler}
 */
const isOwnAccount = (req, res, next) => {
  const isAuthorized =
    req.user._id.toString() === req.params.userId || req.user.role === 'admin';
  if (!isAuthorized) {
    return res.sendStatus(403);
  }

  next();
};

/**
 * @description
 * Check if the token is valid.
 *
 * @returns {import("express").RequestHandler}
 */
const checkCreateUserAuth = async (req, res, next) => {
  try {
    if (typeof req.headers.authorization !== 'string') {
      return next();
    }

    const tokenParts = req.headers.authorization.split(' ');
    if (tokenParts.length !== 2) {
      return res.sendStatus(401);
    }

    const [bearer, token] = tokenParts;

    if (bearer !== 'Bearer' || !token) {
      return res.sendStatus(401);
    }

    const decodedToken = await jose.jwtVerify(
      token,
      authConfig.accessTokenSecret,
    );
    const user = await UserMongo.findById(decodedToken.payload.sub);

    if (!user) {
      return res.sendStatus(401);
    }

    req.user = user;

    return next();
  } catch (error) {
    return next(error);
  }
};
module.exports = { isOwnAccount, checkCreateUserAuth };
