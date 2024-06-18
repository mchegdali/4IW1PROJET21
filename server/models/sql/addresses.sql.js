import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../../sequelize.js';

class AddressesSequelize extends Model {}

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
    modelName: 'Addresses',
    tableName: 'addresses',
  },
);

export default AddressesSequelize;
