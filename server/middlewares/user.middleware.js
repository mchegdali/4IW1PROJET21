/**
 *
 * @type {import("express").RequestHandler}
 */
const isOwnAccount = (req, res, next) => {
  const isAuthorized =
    req.user.id === req.params.userId || req.user.role === 'admin';
  if (!isAuthorized) {
    return res.sendStatus(403);
  }

  next();
};

module.exports = { isOwnAccount };
