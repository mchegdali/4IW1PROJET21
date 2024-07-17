const { DataTypes, Model } = require('sequelize');


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
      
  }
  async toMongo() {
    const user = await this.sequelize.models.users.findByPk(
      this.userId,
    );
    const shipping = await this.sequelize.models.users.findByPk(
          this.shippingId,
        );
    return {
      _id: this.id,
      paymentStatus: this.paymentStatus,
      deliveryStatus: this.deliveryStatus,
      orderStatus: this.orderStatus,
      items: this.items,
      user: user.toMongo(),
      shpping: shipping.toMongo
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
      paymentStatus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deliveryStatus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      orderStatus: {
        type: DataTypes.STRING,
        allowNull: false,
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
