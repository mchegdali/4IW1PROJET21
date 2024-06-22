import { DataTypes, Model } from 'sequelize';

import AddressesSequelize from './addresses.sql.js';
import dayjs from 'dayjs';
import { hash } from '@node-rs/argon2';
import authConfig from '../../config/auth.config.js';

const UsersSequelize = (sequelize) => {
  class UsersSequelize extends Model {
    static associate(models) {
      UsersSequelize.hasMany(models.AddressesSequelize, {
        as: 'addresses',
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  UsersSequelize.init(
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
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'users',
      scopes: {
        toMongo: {
          attributes: {
            include: [['id', '_id']],
            exclude: ['id'],
          },
          include: [
            {
              as: 'addresses',
              model: AddressesSequelize,
              attributes: ['name', 'slug', ['id', '_id']],
            },
          ],
        },
      },
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
      },
    },
  );

  return UsersSequelize;
};

export default UsersSequelize;
