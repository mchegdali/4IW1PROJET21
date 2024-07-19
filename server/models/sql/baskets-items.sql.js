const { Model } = require('sequelize');

const BasketsItemsSequelize = (sequelize) => {
  class BasketsItems extends Model {
    static associate(models) {
      BasketsItems.belongsTo(models.baskets);
      BasketsItems.belongsTo(models.products);
    }
  }

  BasketsItems.init(
    {},
    {
      sequelize,
      modelName: 'basketsItems',
    },
  );

  return BasketsItems;
};

module.exports = BasketsItemsSequelize;
