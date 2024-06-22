import { DataTypes, Model } from 'sequelize';
import slugify from '@sindresorhus/slugify';
import ProductsCategoriesSequelize from './products-categories.sql.js';

const ProductsSequelize = (sequelize) => {
  class ProductsSequelize extends Model {
    static associate(models) {
      ProductsSequelize.belongsTo(models.ProductsCategoriesSequelize, {
        as: 'category',
        targetKey: 'id',
        foreignKey: {
          field: 'categoryId',
          name: 'categoryId',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }
  }

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
      tableName: 'products',

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
          attributes: {
            include: [['id', '_id']],
            exclude: ['id', 'categoryId'],
          },
          include: [
            {
              as: 'category',
              model: ProductsCategoriesSequelize,
              attributes: ['name', 'slug', ['id', '_id']],
            },
          ],
        },
      },
    },
  );

  return ProductsSequelize;
};

export default ProductsSequelize;
