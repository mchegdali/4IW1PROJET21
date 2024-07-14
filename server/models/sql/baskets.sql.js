const { DataTypes, Model } = require('sequelize');


const BasketsSequelize = (sequelize) => {
  class Baskets extends Model {
    static associate(models) {
      Baskets.hasMany(models.products, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }

    /**
     * @description
     * Transform the model into a MongoDB-like object
     * Use after a creation or update
     * @returns
     */
    async toMongo() {
      
      const itemsProduct =  await this.sequelize.models.products.findByPk(
        this.productId,
      );
      return {
        _id: this.id,
        itemsProduct: itemsProduct.toMongo(),
          
      };
    }
  }

  Baskets.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      }
      
      
    },
    {
      sequelize,
      modelName: 'baskets',
    },
  );

  return Baskets;
};

module.exports = BasketsSequelize;
