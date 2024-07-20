/* eslint-disable no-unused-vars */
const { DataTypes } = require('sequelize');
const { fakerFR: faker } = require('@faker-js/faker');
const { ProductMongo } = require('../../models/mongo/products.mongo');
const UserMongo = require('../../models/mongo/user.mongo');

/**
 * @typedef { Object } MigrationParams
 * @property { string } name
 * @property { string } [path]
 * @property { Object } context
 * @property { import('sequelize').Sequelize } context.sequelize
 * @property { import('mongoose').Mongoose } context.mongoose
 */

/**
 *
 * @param {MigrationParams} params
 *
 */
const up = async ({ context: { sequelize } }) => {
  try {
    const users = await sequelize.models.users.findAll();
    const products = await ProductMongo.find({}).lean({});

    await sequelize.transaction(async (transaction) => {
      for (const user of users) {
        let basket = await user.getBasket({ transaction });
        if (!basket) {
          basket = await user.createBasket({ transaction });
        }

        const productsToAdd = faker.helpers.arrayElements(products, {
          min: 2,
          max: 3,
        });

        for (const product of productsToAdd) {
          await basket.createItem(
            { productId: product._id.toString() },
            { transaction },
          );
        }
        await UserMongo.updateOne(
          { _id: user.id },
          {
            $push: {
              basket: productsToAdd,
            },
          },
        );
      }
    });
  } catch {
    const BasketItems = sequelize.model('basketsItems');
    const Baskets = sequelize.model('baskets');
    await BasketItems.destroy({ truncate: true, cascade: true });
    await Baskets.destroy({ truncate: true, cascade: true });

    await UserMongo.updateMany({}, { $set: { basket: [] } });
  }
};

/**
 *
 * @param {MigrationParams} params
 *
 */
const down = async ({ context: { sequelize, mongoose } }) => {
  const BasketItems = sequelize.model('basketsItems');
  const Baskets = sequelize.model('baskets');
  await BasketItems.destroy({ truncate: true, cascade: true });
  await Baskets.destroy({ truncate: true, cascade: true });

  await UserMongo.updateMany({}, { $set: { basket: [] } });
};

module.exports = { up, down };
