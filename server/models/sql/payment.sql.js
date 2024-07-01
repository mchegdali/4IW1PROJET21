import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../sequelize.js';


class PaymentSequelize extends Model {}

PaymentSequelize.init({
    _id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    shippingMode : {
        type: DataTypes.ENUM('Colissimo', 'Mondial Relay'),
        allowNull: false,
    },
    paymentMode: {
        type: DataTypes.ENUM('Carte de Credit', 'Paypal'),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'PaymentSequelize',
});

export default PaymentSequelize;