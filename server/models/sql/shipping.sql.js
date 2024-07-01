const { DataTypes, Model } = require('sequelize');

const ShippingSequelize = (sequelize) => {
  class Shipping extends Model {}

  Shipping.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      emailCustomer: {
        type: DataTypes.STRING,
        allowNull: false,
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
      shippingMode: {
        type: DataTypes.ENUM('Colissimo', 'Mondial Relay'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'shippings',
      tableName: 'shippings',
    },
  );

  return Shipping;
};

module.exports = ShippingSequelize;
