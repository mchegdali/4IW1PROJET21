import { DataTypes, Model } from 'sequelize';
import slugify from '@sindresorhus/slugify';

import { sequelize } from '../../sequelize.js';

class ProductsCategoriesSequelize extends Model {}

ProductsCategoriesSequelize.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'idx_unique_products_categories_name',
        msg: 'Ce nom est déjà utilisé.',
      },
      validate: {
        notNull: {
          msg: 'Le nom est obligatoire.',
        },
      },
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'idx_unique_products_categories_slug',
        msg: 'Ce slug est déjà utilisé.',
      },
      validate: {
        notNull: {
          msg: 'Le slug est obligatoire.',
        },
      },
    },
  },
  {
    sequelize,
    modelName: 'ProductsCategories',
    tableName: 'products_categories',
    underscored: true,
    hooks: {
      beforeValidate: (item) => {
        if (!item.slug) {
          item.slug = slugify(item.name);
        }
      },
    },
  },
);

export default ProductsCategoriesSequelize;
