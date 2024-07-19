/**
 *
 * @type {import("express").RequestHandler}
 */
const isOwnAccount = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('process.env.NODE_ENV', process.env.NODE_ENV);
    return next();
  }
  if (req.user.id !== req.params.userId || req.user.role !== 'admin') {
    return res.sendStatus(403);
  }

  next();
};

module.exports = { isOwnAccount };
