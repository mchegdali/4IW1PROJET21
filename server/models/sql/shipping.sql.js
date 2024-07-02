import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../sequelize.js';
// import PaymentSequelize from '../mongo/payment.js';

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
    

}, {
     
    sequelize,
    modelName: 'Products',
    tableName: 'products',

})
export default ShippingSequelize;