const OrderMongo = require('../models/mongo/orders.mongo');
const uuidSchema = require('../schemas/uuid.schema');

/**
 *
 
@type {import("express").RequestHandler}*/
const isOwnOrder = async (req, res, next) => {
  const { data: id, success } = uuidSchema.safeParse(req.params.id);

  if (!success) {
    return res.sendStatus(404);
  }

  const order = await OrderMongo.findById(id);
  if (!order) {
    console.log('order not found');
    return res.sendStatus(404);
  }
  const isAuthorized =
    req.user._id.toString() === order.user._id.toString() ||
    req.user.role === 'admin';

  if (!isAuthorized) {
    return res.sendStatus(403);
  }

  next();
};

module.exports = { isOwnOrder };
