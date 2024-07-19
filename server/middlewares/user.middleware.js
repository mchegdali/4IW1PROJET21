/**
 *
 * @type {import("express").RequestHandler}
 */
const isOwnAccount = (req, res, next) => {
  if (!req.user || req.user.id !== req.params.userId || req.user.role !== 'admin') {
    return res.sendStatus(403);
  }

  next();
};

<<<<<<< HEAD
=======

>>>>>>> 472b0f9 (modif front panier debut liaison a stripe et gestion conglit)
module.exports = { isOwnAccount };