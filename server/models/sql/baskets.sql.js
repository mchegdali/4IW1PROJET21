const { DataTypes, Model } = require('sequelize');
const UserMongo = require('../mongo/user.mongo');

const BasketsSequelize = (sequelize) => {
  class Baskets extends Model {
    async toMongo(options) {
      const items = await this.getItems(options);
      return items;
    }

    static associate(models) {
      Baskets.belongsTo(models.users, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Baskets.hasMany(models.basketsItems, {
        as: 'items',
      });

      Baskets.addHook('afterCreate', async (basket, options) => {
        const basketMongo = await basket.toMongo(options);
        await UserMongo.updateOne(
          { _id: basket.userId },
          {
            $set: {
              basket: basketMongo,
            },
          },
        );
      });

      Baskets.addHook('afterDestroy', async (basket) => {
        await UserMongo.updateOne(
          { _id: basket.userId },
          {
            $set: {
              basket: [],
            },
          },
        );
      });

      Baskets.addHook('afterUpdate', async (basket, { transaction }) => {
        const basketMongo = await basket.toMongo({ transaction });
        await UserMongo.updateOne(
          { _id: basket.userId },
          {
            $set: {
              basket: basketMongo,
            },
          },
        );
      });
    }
  }

  Baskets.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: 'baskets',
    },
  );

  return Baskets;
};

module.exports = BasketsSequelize;
