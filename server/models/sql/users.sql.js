const { DataTypes, Model } = require('sequelize');
const dayjs = require('dayjs');
const { hash } = require('@node-rs/argon2');
const authConfig = require('../../config/auth.config');
const UserMongo = require('../mongo/user.mongo');

const UsersSequelize = (sequelize) => {
  class Users extends Model {
    static associate(models) {
      Users.hasMany(models.addresses, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Users.hasMany(models.orders, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Users.hasOne(models.baskets, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }

    async toMongo({ transaction }) {
      const [addresses, basket] = await Promise.all([
        this.getAddresses({ transaction }),
        this.getBasket({ transaction }),
      ]);

      const addressesMongo = addresses.map((address) => address.toMongo());

      return {
        _id: this.id,
        fullname: this.fullname,
        email: this.email,
        password: this.password,
        passwordValidUntil: this.passwordValidUntil,
        isVerified: this.isVerified,
        role: this.role,
        addresses: addressesMongo,
        basket: basket ?? [],
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
      paranoid: true,
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
        afterCreate: async (user, { transaction }) => {
          const userMongo = await user.toMongo({ transaction });
          await UserMongo.create(userMongo);
        },
        afterUpdate: async (user, { transaction }) => {
          const userMongo = await user.toMongo({ transaction });
          await UserMongo.updateOne(
            { _id: user.id },
            {
              $set: userMongo,
            },
            {
              upsert: true,
            },
          );
        },
        afterDestroy: async (user, { force }) => {
          if (force) {
            await UserMongo.deleteOne({ _id: user.id });
          } else {
            await UserMongo.updateOne(
              { _id: user.id },
              {
                $set: {
                  deletedAt: user.deletedAt,
                },
              },
            );
          }
        },
      },
    },
  );

  return Users;
};

module.exports = UsersSequelize;
