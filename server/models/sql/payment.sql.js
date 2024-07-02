// import { DataTypes, Model } from 'sequelize';
// import { sequelize } from '../../sequelize.js';

const PaymentSequelize = (sequelize) => {
  class Payment extends Model {}

// class PaymentSequelize extends Model {}

// PaymentSequelize.init({
//     id: {
//         type: DataTypes.UUID,
//         primaryKey: true,
//         defaultValue: DataTypes.UUIDV4,
//     },
//     numberCard : {
//         type: DataTypes.String,
//         allowNull: false,
//     },
//     expiryAt: {
//         type: DataTypes.Date,
//         allowNull: false,
//     },
//     cardCode: {
//         type: DataTypes.String,
//         allowNull: false,
//     }
// }, {
//     sequelize,
//     modelName: 'Payment',
//     tableName: 'payments'
// });

// export default PaymentSequelize;