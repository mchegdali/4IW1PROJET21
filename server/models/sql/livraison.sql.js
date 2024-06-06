import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../sequelize.js';


class LivraisonSequelize extends Model {}

LivraisonSequelize.init({
    _id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    emailCustomer: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country: {
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
    // livraisonMode : {
    //     type: DataTypes.ENUM('Colissimo', 'Mondial Relay'),
    //     allowNull: false,
    // },
    // paymentMode: {
    //     type: DataTypes.ENUM('Carte de Credit', 'Paypal'),
    //     allowNull: false,
    // },
}, {
    sequelize,
    modelName: 'LivraisonSequelize',
});

export default LivraisonSequelize;