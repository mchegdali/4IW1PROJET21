const { DataTypes, Model } = require('sequelize');
const slugify = require('../../utils/slugify');
const { ProductMongo } = require('../mongo/products.mongo');
const UserMongo = require('../mongo/user.mongo');

const ProductsSequelize = (sequelize) => {
  class Products extends Model {
    async toMongo(options) {
      const category = await this.getCategory(options);
      return {
        _id: this.id,
        slug: this.slug,
        name: this.name,
        description: this.description,
        category: category
          ? {
              _id: category.id,
              name: category.name,
              slug: category.slug,
            }
          : null,
        category: category
          ? {
              _id: category.id,
              name: category.name,
              slug: category.slug,
            }
          : null,
        image: this.image,
        price: this.price,
      };
    }

    static associate(models) {
      Products.belongsTo(models.categories, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });

      Products.hasMany(models.basketsItems);

      Products.addHook('afterCreate', async (product, { transaction }) => {
        const productMongo = await product.toMongo({ transaction });
        await ProductMongo.create(productMongo);
      });

      Products.addHook('afterUpdate', async (product, { transaction }) => {
        const productMongo = await product.toMongo({ transaction });
        await ProductMongo.updateOne(
          { _id: product.id },
          {
            $set: productMongo,
          },
          {
            upsert: true,
          },
        );

        await UserMongo.updateMany(
          {
            'basket._id': product.id,
          },
          {
            $set: {
              'basket.$[elem]': productMongo,
            },
          },
          {
            arrayFilters: [{ 'elem._id': product.id }],
          },
        );
      });

      Products.addHook('afterDestroy', async (product) => {
        await ProductMongo.deleteOne({ _id: product.id });
        await UserMongo.updateMany(
          {
            'basket._id': product.id,
          },
          {
            $pull: { basket: { _id: product.id } },
          },
        );
      });
    }
  }

  Products.init(
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
        type: DataTypes.DECIMAL(10, 2).UNSIGNED,
        type: DataTypes.DECIMAL(10, 2).UNSIGNED,
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
      modelName: 'products',
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
    },
  );

  return Products;
};

module.exports = ProductsSequelize;
