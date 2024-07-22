const { DataTypes, Model } = require('sequelize');
const dayjs = require('dayjs');

const OrdersSequelize = (sequelize) => {
  class Orders extends Model {
    static associate(models) {
      Orders.belongsTo(models.users, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
      Orders.hasOne(models.shippings, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
      Orders.belongsTo(models.status, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        as: 'status',
      });
    }

    async toMongo() {
      const user = await this.sequelize.models.users.findByPk(this.userId);
      const shipping = await this.sequelize.models.shippings.findByPk(
        this.shippingId,
      );
      const status = await this.sequelize.models.status.findByPk(this.statusId);
      return {
        _id: this.id,
        items: this.items,
        user: user ? user.toMongo() : null,
        shipping: shipping ? shipping.toMongo() : null,
        status: status ? status.toMongo() : null,
      };
    }
  }

  Orders.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      statusId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      items: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'orders',
    },
  );

  return Orders;
};

module.exports = OrdersSequelize;
