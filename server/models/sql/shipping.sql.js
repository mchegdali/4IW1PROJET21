import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../sequelize.js';
import DeliveryChoiceSequelize from './deliveryChoice.sql.js';


class ShippingSequelize extends Model {}

ShippingSequelize.init({
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
    
},{
    sequelize,
    modelName: 'Shipping',
    tableName: 'shippings',
});
// 1:M relationship between Products and ProductsCategories
ShippingSequelize.belongsTo(DeliveryChoiceSequelize, {
  as: 'deliveryChoice',
  targetKey: 'id',
  foreignKey: {
    field: 'deliveryChoiceId',
    name: 'deliveryChoiceId',
  },
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

export default ShippingSequelize;