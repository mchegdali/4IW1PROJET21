import { DataTypes, Model } from 'sequelize';
import slugify from '@sindresorhus/slugify';

import { sequelize } from '../../sequelize.js';

class ProductsCategoriesSequelize extends Model {}

ProductsCategoriesSequelize.init(
  {
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
    },
  },
  {
    sequelize,
    modelName: 'ProductsCategories',
    timestamps: false,
  },
);

export default ProductsCategoriesSequelize;
