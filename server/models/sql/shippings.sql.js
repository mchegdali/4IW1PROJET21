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
      const deliveryChoiceId =
        await this.sequelize.models.deliveryChoices.findByPk(
          this.deliveryChoiceId,
        );
      const orders = await this.sequelize.models.orders.findByPk(this.orders);
      return {
        _id: this.id,
        fullname: this.fullname,
        street: this.street,
        zipCode: this.zipCode,
        city: this.city,
        phone: this.phone,
        deliveryChoiceId: deliveryChoiceId.toMongo(),
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
      fullname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      street: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      zipCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
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
