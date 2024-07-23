const OrderMongo = require('../../models/mongo/orders.mongo');
const { ProductMongo } = require('../../models/mongo/products.mongo');
const { v4: uuidv4 } = require('uuid'); // Utilisation de uuid pour générer des UUID
const { faker } = require('@faker-js/faker');

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
  const products = await ProductMongo.find({}).lean();

  const users = await Users.findAll();
  const statuses = await Status.findAll();

  if (users.length === 0 || statuses.length === 0) {
    throw new Error('Missing necessary data for users or statuses');
  }

  const orders = [];

  for (const user of users) {
    for (const status of statuses) {
      const isShippedOrDelivered = status.label === 'Shipped' || status.label === 'Delivered';
      const createdAt = faker.date.past();
      const shippingDate = isShippedOrDelivered
        ? new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000)
        : null;

      const items = faker.helpers.arrayElements(products, { min: 1, max: 10 }).map(item => ({
        _id: uuidv4(),
        name: item.name,
        quantity: faker.number.int({ min: 1, max: 5 }), // Utilisation de faker.number.int pour obtenir un entier
        category: item.category ? {
          _id: item.category._id,
          name: item.category.name,
          slug: item.category.slug,
        } : null,
        price: item.price,
      }));

      const totalPrice = items.reduce(
        (total, item) => total + parseFloat(item.price) * item.quantity,
        0,
      );

      const order = {
        _id: uuidv4(),
        orderNumber: uuidv4(),
        deliveryDate: faker.datatype.boolean() ? faker.date.future() : null,
        shippingDate: shippingDate,
        totalPrice: totalPrice.toFixed(2), // Assurez-vous que c'est une chaîne de caractères pour Decimal128
        status: {
          _id: status.id,
          label: status.label,
        },
        user: {
          _id: user.id,
          fullname: user.fullname,
          email: user.email,
        },
        address: {
          _id: uuidv4(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          region: faker.location.state(),
          country: faker.location.country(),
          street: faker.location.streetAddress(),
          zipCode: faker.location.zipCode(),
          city: faker.location.city(),
          phone: faker.phone.number(),
        },
        items: items,
        createdAt: createdAt,
        updatedAt: createdAt,
      };
      orders.push(order);
    }
  }

  if (typeof OrderMongo.insertMany !== 'function') {
    throw new Error('OrderMongo.insertMany is not a function. Make sure OrderMongo is defined correctly and is a valid Mongoose model.');
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
