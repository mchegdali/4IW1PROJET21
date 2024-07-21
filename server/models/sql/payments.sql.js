const { DataTypes, Model } = require('sequelize');

const PaymentsSequelize = (sequelize) => {
  class Payments extends Model {
    static associate(models) {
      Payments.hasOne(models.orders, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
      Payments.hasOne(models.users, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }
    async toMongo() {
      const user = await this.sequelize.models.users.findByPk(this.userId);
      const order = await this.sequelize.models.orders.findByPk(this.orderId);
      return {
        _id: this.id,
        paymentStatus: this.paymentStatus,
        totalPrice: this.totalPrice,
        user: {
          _id: user.id,
          fullname: user.fullname,
          email: user.email,
        },
        order: await order.toMongo(),
      };
    }
  }

  Payments.init(
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
      totalPrice: {
        type: DataTypes.DECIMAL.UNSIGNED,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'payments',
    },
  );

  return Payments;
};

module.exports = PaymentsSequelize;
