import { DataTypes, Model } from 'sequelize';
import slugify from '@sindresorhus/slugify';

import { sequelize } from '../../sequelize.js';
import ProductsCategoriesSequelize from './products-categories.sql.js';

class ProductsSequelize extends Model {}

ProductsSequelize.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    price: {
      type: DataTypes.DECIMAL.UNSIGNED,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Products',
    tableName: 'products',
    underscored: true,
    hooks: {
      beforeValidate: (item) => {
        /**
         * @type {string}
         */
        const id = item.getDataValue('id');
        const lastPart = id.split('-').at(-1);
        if (!item.slug) {
          item.slug = slugify(`${item.name}-${lastPart}`);
        } else {
          item.slug = slugify(`${item.slug}-${lastPart}`);
        }
      },
    },
    scopes: {
      toMongo: {
        fieldMap: {
          id: '_id',
        },
        include: ['category'],
      },
    },
  },
);

// 1:M relationship between Products and ProductsCategories
ProductsSequelize.belongsTo(ProductsCategoriesSequelize, {
  as: 'category',
  targetKey: 'id',
  foreignKey: 'categoryId',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

ProductsCategoriesSequelize.hasMany(ProductsSequelize, {
  as: 'product',
  sourceKey: 'id',
  foreignKey: 'categoryId',
});

export default ProductsSequelize;
