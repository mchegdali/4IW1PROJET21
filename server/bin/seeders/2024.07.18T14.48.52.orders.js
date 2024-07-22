const OrderMongo = require('../../models/mongo/orders.mongo');
const crypto = require('node:crypto');
const { ProductMongo } = require('../../models/mongo/products.mongo');
const { fakerFR: faker } = require('@faker-js/faker');

/**
 * @typedef { Object } MigrationParams
 * @property { string } name
 * @property { string } [path]
 * @property { Object } context
 * @property { import('sequelize').Sequelize } context.sequelize
 * @property { import('mongoose').Mongoose } context.mongoose
 */

/**
 * @param {MigrationParams} params
 */
const up = async ({ context: { sequelize } }) => {
  const Users = sequelize.model('users');
  const Status = sequelize.model('status');
  const Orders = sequelize.model('orders');

  const products = await ProductMongo.find({}).lean({});
  const users = await Users.findAll();
  const statuses = await Status.findAll();

  if (users.length === 0 || statuses.length === 0) {
    throw new Error('Missing necessary data for users or statuses');
  }

  const orders = [];

  for (const user of users) {
    for (const status of statuses) {
      const order = {
        id: crypto.randomUUID(),
        statusId: status.id,
        items: faker.helpers.arrayElements(products, { min: 1, max: 10 }),
        userId: user.id,
        shippingId: null, // Pas de livraison initiale
      };
      orders.push(order);
    }
  }

  const createdOrders = await Orders.bulkCreate(orders, {
    validate: true,
    returning: true,
  });

  // Convertion MongoDB
  const createdOrdersMongo = await Promise.all(
    createdOrders.map(async (order) => {
      const orderMongo = await order.toMongo();
      orderMongo.user = await orderMongo.user;
      orderMongo.status = await orderMongo.status;
      return orderMongo;
    }),
  );

  await OrderMongo.insertMany(createdOrdersMongo);
};

/**
 * @param {MigrationParams} params
 */
const down = async ({ context: { sequelize } }) => {
  const Orders = sequelize.model('orders');

  await Orders.destroy({ truncate: true, cascade: true, force: true });

  await OrderMongo.deleteMany({});
};

module.exports = { up, down };
