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
        const delivery = await this.sequelize.models.deliveryChoices.findByPk(
          this.deliveryChoicesId,
        );
        return {
          _id: this.id,
          emailCustomer: this.emailCustomer,
          email: this.email,
          street: this.street,
          zipCode: this.zipCode,
          city: this.city,
          phone: this.phone,
          delivery: delivery.toMongo(),
          //payment var
        };
      }
  }
  Shippings.init(
    {
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
    modelName: 'shippings',
   
})
return Shippings;
};
module.exports= ShippingSequelize;