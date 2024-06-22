import { DataTypes, Model } from 'sequelize';

const AddressesSequelize = (sequelize) => {
  class AddressesSequelize extends Model {
    static associate(models) {
      AddressesSequelize.belongsTo(models.UsersSequelize, {
        as: 'user',
        targetKey: 'id',
        foreignKey: {
          field: 'userId',
          name: 'userId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  AddressesSequelize.init(
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
      tableName: 'addresses',
    },
  );

  return AddressesSequelize;
};

export default AddressesSequelize;
