const { DataTypes, Model } = require('sequelize');

const AddressesSequelize = (sequelize) => {
  class Addresses extends Model {
    static associate(models) {
      Addresses.belongsTo(models.users, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }

    toMongo() {
      return {
        _id: this.id,
        street: this.street,
        city: this.city,
        zipCode: this.zipCode,
      };
    }
  }

  Addresses.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      street: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      zipCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'addresses',
    },
  );

  return Addresses;
};

module.exports = AddressesSequelize;
