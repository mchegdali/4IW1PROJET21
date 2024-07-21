const OrderMongo = require('../models/mongo/orders.mongo');

/**
 *
 * @type {import("express").RequestHandler}
 */
const isOwnOrder = async (req, res, next) => {
  const order = await OrderMongo.findById(req.params.id);
  if (!order) {
    return res.sendStatus(404);
  }
  const isAuthorized = req.user._id.toString() === order.user._id.toString() || req.user.role === 'admin';
  if (!isAuthorized) {
    return res.sendStatus(403);
  }
  req.order = order;
  next();
};

module.exports = { isOwnOrder };
