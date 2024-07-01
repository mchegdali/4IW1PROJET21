const { DataTypes, Model } = require('sequelize');
const slugify = require('../../utils/slugify');

const ProductsSequelize = (sequelize) => {
  class Products extends Model {
    static associate(models) {
      Products.belongsTo(models.categories, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }

    /**
     * @description
     * Transform the model into a MongoDB-like object
     * Use after a creation or update
     * @returns
     */
    async toMongo() {
      const category = await this.sequelize.models.categories.findByPk(
        this.categoryId,
      );

      return {
        _id: this.id,
        slug: this.slug,
        name: this.name,
        description: this.description,
        category: category.toMongo(),
        image: this.image,
        price: this.price,
      };
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
