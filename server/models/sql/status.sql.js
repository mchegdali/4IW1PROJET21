const { DataTypes, Model } = require('sequelize');

const StatusSequelize = (sequelize) => {
  class Status extends Model {
    static associate(models) {
      // Associez le modèle Status aux autres modèles si nécessaire
    }

    async toMongo() {
      return {
        _id: this.getDataValue('id'),
        label: this.getDataValue('label'),
      };
    }
  }

  Status.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Libellé déjà utilisé',
        },
        validate: {
          notNull: { msg: 'Libellé obligatoire' },
          notEmpty: { msg: 'Libellé ne peut pas être vide' },
        },
      },
    },
    {
      sequelize,
      modelName: 'status',
    },
  );

  return Status;
};

module.exports = StatusSequelize;
