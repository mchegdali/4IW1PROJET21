const { DataTypes, Model } = require('sequelize');

const ShippingSequelize = (sequelize) => {
  class Shippings extends Model {
    static associate(models) {
      Shippings.belongsTo(models.deliveryChoices, {
        onDelete: 'SET NULL',
        onUpdated: 'CASCADE',
      });
      Shippings.hasOne(models.orders, {
        onDelete: 'SET NULL',
        onUpdated: 'CASCADE',
      });
    }
    async toMongo() {
      const deliveryChoice = await this.sequelize.models.deliveryChoices.findByPk(this.deliveryChoiceId);
      const address =  await this.sequelize.models.addresses.findByPk(  this.addressesId );
      const orders = await this.sequelize.models.orders.findByPk(this.orders);
      return {
        _id: this.id,
        address: address.toMongo(),
        deliveryChoice: deliveryChoice.toMongo(),
        orders: orders(),
      };
    }
  }
  Shippings.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: 'shippings',
    },
  );
  return Shippings;
};
module.exports = ShippingSequelize;
