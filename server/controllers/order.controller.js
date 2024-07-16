const httpErrors = require('http-errors');
const validator = require('validator');
const sequelize = require('../models/sql');
const {
  orderQuerySchema,
  orderCreateSchema,
  orderUpdateSchema,
} = require('../schemas/orders.schema');
const { NotFound } = httpErrors;
const Orders = sequelize.model('orders');
const { ZodError } = require('zod');
const OrdersMongo = require('../models/mongo/orders.mongo');
const formatZodError = require('../utils/format-zod-error');
const { ValidationError } = require('sequelize');
const UsersMongo = require ("../models/mongo/user.mongo");
const BasketsMongo = require ("../models/mongo/baskets.mongo")
/**
 * @type {import('express').RequestHandler}
 */
async function createOrders(req, res, next) {
  try {
    // Valider les données d'entrée
    const orderCreateBody = await orderCreateSchema.parseAsync(req.body);
    

    console.log(typeof(orderCreateBody.user),typeof(user))
    const result = await sequelize.transaction(async (t) => {
      if (orderCreateBody.user) {
        const user = await UsersMongo.findById(
          orderCreateBody.user,);
          if (!user) {
            throw new NotFound('Utilisateur introuvable');
          }
        
      }
      const user = await UsersMongo.findById(
        orderCreateBody.user,);
        console.log("test : " ,typeof(user))
      // Vérifier le panier de l'utilisateur dans MongoDB
      // Find basket in MongoDB
      
      const basket = await BasketsMongo.findOne({
        user : user
      })
      .sort({ createdAt: -1 })  // Sort by createdAt in descending order (latest first)
      .exec();
      
      console.log('basket',basket)
      if (!basket) {
        throw new NotFound('Panier introuvable');
      }
      // Extraire les items et le total price du panier
      const { items, totalPrice } = basket;
      console.log("items ",items,"totalPrice",totalPrice)
      // Créer la commande dans SQL
      const order = await Orders.create({
        user: user._id,
        paymentStatus: 'Pending',
        deliveryStatus: 'Pending',
        orderStatus: 'Pending',
        items: JSON.stringify(items), 
        totalPrice: totalPrice,
      }, { transaction: t });
      console.log("cree commande sql ",order)
      // Convertir la commande SQL en un objet compatible avec MongoDB
      const orderMongo = {
        _id: order.id,
        paymentStatus: order.paymentStatus,
        deliveryStatus: order.deliveryStatus,
        orderStatus: order.orderStatus,
        items: items.map(item => ({
          _id: item._id.toString(), 
          name: item.name,
          category: item.category,
          image: item.image,
          price: item.price,
          quantity: item.quantity
        })),
        totalPrice: totalPrice.toString(), 
        user: {
          _id: user._id, 
          fullname: user.fullname,
          email: user.email,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Sauvegarder orderMongo dans MongoDB
      const orderDoc = await OrdersMongo.create(orderMongo);
      return orderDoc;
    });

    return res.status(201).json(result);
  } catch (error) {
    console.log('Error creating order:', error);
    if (error instanceof NotFound) {
      return res.status(404).json({ message: error.message });
    }
    return next(error);
  }
}

async function createOrder(req, res, next) {
  try {
    const userId = req.params.id; // User ID from the route parameter

    // Find user in MongoDB
    const user = await UsersMongo.findById(userId).exec();
    if (!user) {
      throw new NotFound('Utilisateur introuvable');
    }

    
    if (!basket) {
      throw new NotFound('Panier introuvable');
    }

    // Extract items and total price from the basket
    const { items, totalPrice } = basket;

    // Create the order in SQL and save in MongoDB within a transaction
    const result = await sequelize.transaction(async (t) => {
      // Create the order in SQL
      const newOrder = await Orders.create({
        userId: userId,
        paymentStatus: 'Pending',
        deliveryStatus: 'Pending',
        orderStatus: 'Pending',
        items: items,
        totalPrice: totalPrice,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, { transaction: t });

      // Convert SQL order to MongoDB-like object
      const orderMongo = {
        _id: newOrder.id.toString(), // Ensure _id is a string
        paymentStatus: newOrder.paymentStatus,
        deliveryStatus: newOrder.deliveryStatus,
        orderStatus: newOrder.orderStatus,
        items: items.map(item => ({
          _id: item._id.toString(), // Ensure item _id is a string
          name: item.name,
          category: item.category,
          image: item.image,
          price: item.price,
          quantity: item.quantity // Assuming item.quantity is available
        })),
        totalPrice: totalPrice.toString(), // Ensure totalPrice is a string
        user: {
          _id: user._id.toString(), // Ensure user _id is a string
          fullname: user.fullname,
          email: user.email,
        },
      };

      // Save orderMongo to MongoDB
      const orderDoc = await OrdersMongo.create(orderMongo);

      return orderDoc;
    });

    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(formatZodError(error));
    }
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Error creating order:', error);
    return next(error);
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getOrder(req, res, next) {
  try {
    const id = req.params.id;

    const filter = {
      _id: id,
    };

    const shipping = await OrdersMongo.findOne(filter);
    if (!orderQuerySchema) {
      return res.sendStatus(404);
    }
    return res.json(shipping);
  } catch (error) {
    return next(error);
  }
}
/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getOrders(req, res, next) {
  try {
    const basket = await OrdersMongo.find({}).lean({});
    return res.json(basket);
  } catch (error) {
    return next(error);
  }
}
/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function updateOrder(req, res, next) {
  try {
    const id = req.params.id;
    const sqlWhere = {
      id,
    };
    const mongoWhere = {
      _id: id,
    };

    const shippingUpdateBody = await orderUpdateSchema.parseAsync(req.body);
    const updatedKeys = Object.keys(shippingUpdateBody);

    const result = await sequelize.transaction(async (t) => {
      const [affectedRowsCount, affectedRows] = await Shippings.update(
        shippingUpdateBody,
        {
          where: sqlWhere,
          limit: 1,
          transaction: t,
          returning: true,
        },
      );

      if (affectedRowsCount === 0) {
        throw new NotFound('livraison introuvable');
      }

      const shipping = await Shippings.scope('toMongo').findByPk(
        affectedRows[0].getDataValue('id'),
        {
          transaction: t,
        },
      );

      const shippingMongo = {};

      for (const key of updatedKeys) {
        shippingMongo[key] = shipping.getDataValue(key);
      }

      const replaceResult = await OrdersMongo.findOneAndUpdate(
        mongoWhere,
        shippingMongo,
        {
          new: true,
        },
      );

      if (!replaceResult) {
        throw new NotFound('livraison introuvable');
      }

      return replaceResult;
    });

    return res.status(200).json(result);
  } catch (error) {
    console.log(error)
    return next(error);
  }
}
async function deleteOrder(req,res,next) {
  try {
     const id = req.params.id;
     const sqlWhere = {
      id,
    };
    const mongoWhere = {
      '_id' : id,
    };

    const [deletedCountSql, deletedCountMongo] = await Promise.all([
      Baskets.destroy({ where: sqlWhere }),
      OrdersMongo.deleteOne(mongoWhere),
    ]);

    if (deletedCountSql === 0 && deletedCountMongo.deletedCount === 0) {
      return res.sendStatus(404);
    }

  } catch(error) {
    console.log(error);
    return next (error);
  }
}
module.exports = {
  createOrder,  
  createOrders,
  getOrder,
  getOrders,
  updateOrder,
  deleteOrder
};
