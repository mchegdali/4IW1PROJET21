const { DataTypes, Model } = require('sequelize');

const DeliveryChoiceSequelize = (sequelize) => {

  class DeliveryChoices extends Model {
    static associate(models) {
     DeliveryChoices.hasOne(models.shippings, {
        as: 'shippings',
      });
    }

    toMongo() {
      return {
        _id: this.id,
        name: this.name,
      };
    }
  }

  DeliveryChoices.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          name: 'idx_unique_shipping_deliveryChoice_name',
          msg: 'Ce nom est déjà utilisé.',
        },
        validate: {
          notNull: {
            msg: 'Le nom est obligatoire.',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'deliveryChoices',
      scopes: {
        toMongo: {
          attributes: {
            include: [['id', '_id']],
            exclude: ['id'],
          },
        },
      },
    },
  );

  return DeliveryChoices;
};

module.exports = DeliveryChoiceSequelize;