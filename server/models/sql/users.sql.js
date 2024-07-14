const { DataTypes, Model } = require('sequelize');

const dayjs = require('dayjs');
const { hash } = require('@node-rs/argon2');
const authConfig = require('../../config/auth.config');

const UsersSequelize = (sequelize) => {
  class Users extends Model {
    static associate(models) {
      Users.hasMany(models.addresses, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Users.belongsTo(models.orders, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Users.hasOne(models.baskets, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
  
    }
    
    async toMongo() { 
      const order = await this.sequelize.models.orders.findByPk(
        this.orderId,
      );
      return {
        _id: this.getDataValue('id'),

        fullname: this.getDataValue('fullname'),
        email: this.getDataValue('email'),
        password: this.getDataValue('password'),
        passwordValidUntil: this.getDataValue('passwordValidUntil'),
        isVerified: this.getDataValue('isVerified'),
        role: this.getDataValue('role'),
        addresses:
          this.getDataValue('addresses')?.map((address) => address.toMongo()) ??
          [],
          order : order.toMongo(),
      };
    }
  }

  Users.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      fullname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Adresse email déjà utilisée',
        },
        validate: {
          notNull: { msg: 'Adresse email obligatoire' },
          isEmail: {
            msg: 'Adresse email invalide',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      passwordValidUntil: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: dayjs().add(60, 'day').toDate(),
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      role: {
        type: DataTypes.ENUM('user', 'admin', 'accountant'),
        defaultValue: 'user',
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'users',
      hooks: {
        afterValidate: async (user, { fields }) => {
          if (fields.includes('password')) {
            const newPassword = await hash(
              user.password,
              authConfig.hashOptions,
            );
            user.password = newPassword;
            user.passwordValidUntil = dayjs().add(60, 'day').toDate();
          }
        },
        // beforeUpsert: async function (user, { fields }) {
        //   if (fields.includes('password')) {
        //     const newPassword = await hash(
        //       user.password,
        //       authConfig.hashOptions,
        //     );
        //     user.password = newPassword;
        //     user.passwordValidUntil = dayjs().add(60, 'day').toDate();
        //   }
        // },
        // beforeUpdate: async (user, { fields }) => {
        //   if (fields.includes('password')) {
        //     const newPassword = await hash(
        //       user.password,
        //       authConfig.hashOptions,
        //     );
        //     user.password = newPassword;
        //     user.passwordValidUntil = dayjs().add(60, 'day').toDate();
        //   }
        // },
      },
    },
  );

  return Users;
};

module.exports = UsersSequelize;
