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
      defaultValue() {
        return slugify(this.name);
      },
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
  },
);

// 1:M relationship between Products and ProductsCategories
ProductsSequelize.belongsTo(ProductsCategoriesSequelize);
ProductsCategoriesSequelize.hasMany(ProductsSequelize);

export default ProductsSequelize;
