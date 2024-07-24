const OrderMongo = require('../../models/mongo/orders.mongo');
const { ProductMongo } = require('../../models/mongo/products.mongo');
const crypto = require('node:crypto');
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
  const products = await ProductMongo.find({}).lean({});

  const users = await Users.findAll();
  const statuses = await Status.findAll();

  if (users.length === 0 || statuses.length === 0) {
    throw new Error('Missing necessary data for users or statuses');
  }

  const orders = [];

  for (const user of users) {
    for (const status of statuses) {
      const isShippedOrDelivered =
        status.label === 'Shipped' || status.label === 'Delivered';
      const createdAt = faker.date.past();
      const shippingDate = isShippedOrDelivered
        ? new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000)
        : null;

      const items = faker.helpers.arrayElements(products, { min: 4, max: 5 });

      const totalPrice = items.reduce((total, item) => {
        return total + parseFloat(item.price.toString()) * (item.quantity || 1);
      }, 0);

      const addresses = await user.getAddresses();

      const address = faker.helpers.arrayElement(addresses).toMongo();

      const order = {
        _id: crypto.randomUUID(),
        orderNumber: crypto.randomUUID(),
        deliveryDate: faker.datatype.boolean() ? faker.date.future() : null,
        shippingDate: shippingDate,
        status: {
          _id: status.id,
          label: status.label,
        },
        items,
        totalPrice,
        user: {
          _id: user.id,
          fullname: user.fullname,
          email: user.email,
        },
        address: address,
        createdAt: createdAt, // Date actuelle
      };
      orders.push(order);
    }
  }

  if (typeof OrderMongo.insertMany !== 'function') {
    throw new Error(
      'OrderMongo.insertMany is not a function. Make sure OrderMongo is defined correctly and is a valid Mongoose model.',
    );
  }

  await OrderMongo.insertMany(orders);
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
