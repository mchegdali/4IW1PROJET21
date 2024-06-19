import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../sequelize.js';


class DeliveryChoiceSequelize extends Model {}

DeliveryChoiceSequelize.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'DeliveryChoice',
    tableName: 'deliveryChoice'
});

export default DeliveryChoiceSequelize;