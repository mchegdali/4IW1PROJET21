const { DataTypes, Model } = require('sequelize');

const ShippingSequelize = (sequelize) => {
  class Shippings extends Model {
      static associate(models) {
      Shippings.belongsTo(models.deliveryChoices, {
        onDelete: 'SET NULL',
        onUpdated: 'CASCADE',
      });
      // payment
      //definit
      }
      async toMongo() {
        const deliveryChoiceId = await this.sequelize.models.deliveryChoices.findByPk(
          this.deliveryChoiceId,
        );
        return {
          _id: this.id,
          fullname: this.fullname,
          street: this.street,
          zipCode: this.zipCode,
          city: this.city,
          phone: this.phone,
          deliveryChoiceId: deliveryChoiceId.toMongo(),
          //payment var
        };
      }
  }
  Shippings.init({
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
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
      statusOrder: {
        type: DataTypes.STRING,
        allowNull: true,
      }

}, {
     
    sequelize,
    modelName: 'shippings',
   
})
return Shippings;
};
module.exports= ShippingSequelize;