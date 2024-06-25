const { DataTypes, Model } = require('sequelize');
const slugify = require('../../utils/slugify');

const CategoriesSequelize = (sequelize) => {
  class Categories extends Model {
    static associate(models) {
      Categories.hasMany(models.products, {
        as: 'products',
      });
    }

    toMongo() {
      return {
        _id: this.id,
        slug: this.slug,
        name: this.name,
        description: this.description,
      };
    }
  }

  Categories.init(
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
      modelName: 'categories',
      hooks: {
        beforeValidate: (item) => {
          if (!item.slug) {
            item.slug = slugify(item.name, {
              replacement: '-',
              lower: true,
              strict: true,
              trim: true,
              locale: 'fr',
            });
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

  return Categories;
};

module.exports = CategoriesSequelize;
