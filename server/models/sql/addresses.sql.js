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
        firstName: this.firstName,
        lastName: this.lastName,
        street: this.street,
        city: this.city,
        region: this.region,
        zipCode: this.zipCode,
        country: this.country,
        phone: this.phone,
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
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      street: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      region: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      zipCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
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
