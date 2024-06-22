import { DataTypes, Model } from 'sequelize';
import slugify from '@sindresorhus/slugify';

const ProductsCategoriesSequelize = (sequelize) => {
  class ProductsCategoriesSequelize extends Model {
    static associate(models) {
      ProductsCategoriesSequelize.hasMany(models.ProductsSequelize, {
        as: 'products',
      });
    }
  }

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
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'products_categories',

      hooks: {
        beforeValidate: (item) => {
          if (!item.slug) {
            item.slug = slugify(item.name);
          }
        },
      },
      scopes: {
        toMongo: {
          attributes: {
            include: [['id', '_id']],
            exclude: ['id'],
          },
        },
      },
    },
  );

  return ProductsCategoriesSequelize;
};

export default ProductsCategoriesSequelize;
