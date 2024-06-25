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
    }

    toMongo() {
      return {
        _id: this.id,
        fullname: this.fullname,
        email: this.email,
        password: this.password,
        passwordValidUntil: this.passwordValidUntil,
        isVerified: this.isVerified,
        role: this.role,
        addresses: this.addresses.map((address) => address.toMongo()),
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
        unique: true,
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
        beforeCreate: async (user) => {
          if (user.changed('password')) {
            const newPassword = await hash(
              user.get('password'),
              authConfig.hashOptions,
            );
            user.set('password', newPassword);
          }
        },
        beforeUpdate: async (user, { fields }) => {
          if (fields.includes('password')) {
            const newPassword = await hash(
              user.get('password'),
              authConfig.hashOptions,
            );
            user.set('password', newPassword);
          }
        },
      },
    },
  );

  return Users;
};

module.exports = UsersSequelize;
