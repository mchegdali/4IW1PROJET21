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

<<<<<<< HEAD
=======

>>>>>>> 472b0f9 (modif front panier debut liaison a stripe et gestion conglit)
module.exports = { isOwnAccount };