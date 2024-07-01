const { DataTypes, Model } = require('sequelize');

const PaymentSequelize = (sequelize) => {
  class Payment extends Model {}

  Payment.init(
    {
      _id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      shippingMode: {
        type: DataTypes.ENUM('Colissimo', 'Mondial Relay'),
        allowNull: false,
      },
      paymentMode: {
        type: DataTypes.ENUM('Carte de Credit', 'Paypal'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'payments',
    },
  );

  return Payment;
};

module.exports = PaymentSequelize;
