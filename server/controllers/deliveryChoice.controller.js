const DeliveryChoiceMongo = require('../models/mongo/deliveryChoice.mongo');
const sequelize = require('../models/sql');
const DeliveryChoice = sequelize.model('deliveryChoices');

const httpErrors = require('http-errors');

const { NotFound } = httpErrors;
const {
  deliveryChoiceCreateSchema,
  deliveryChoiceUpdateSchema,
  deliveryChoiceQuerySchema,
} = require('../schemas/deliveryChoice.schema');


/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function createDeliveryChoice(req, res, next) {
  try {
    const deliveryChoiceCreateBody = await deliveryChoiceCreateSchema.parseAsync(req.body);

    const result = await sequelize.transaction(async (t) => {

      const createdDeliveryChoice = await DeliveryChoice.create(
        {
          name: deliveryChoiceCreateBody.name,
   
        },
        { transaction: t }
      );

      const deliveryChoiceMongo = {
        _id: createdDeliveryChoice.id, 
        name: deliveryChoiceCreateBody.name,

      };

      
      const createdDeliveryChoiceDoc = await DeliveryChoiceMongo.create(deliveryChoiceMongo);
      console.log(createdDeliveryChoiceDoc)
      return createdDeliveryChoiceDoc;
    });

    return res.status(201);

  } catch (error) {
    return next(error);
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getDeliveryChoice(req, res, next) {
  try {
    const id = req.params.id;

    const filter = {
      _id: id,
    };

    const deliveryChoice = await DeliveryChoiceMongo.findOne(filter);
    if (!deliveryChoiceQuerySchema) {
      return res.sendStatus(404);
    }
    return res.json(deliveryChoice);
  } catch (error) {
    return next(error);
  }
}
/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getDeliveryChoices(req, res, next) {
  try {
    const deliveryChoice = await DeliveryChoiceMongo.find({}).lean({});
    return res.json(deliveryChoice);
  } catch (error) {
    return next(error);
  }
}

async function updateDeliveryChoice(req, res, next) {
  try {
    const updateData = await deliveryChoiceUpdateSchema.parseAsync(req.body);

    const id= req.params.id;

    // Commencer une transaction SQL
    const result = await sequelize.transaction(async (t) => {
      // Mise à jour de la commande dans MongoDB
      const updatedDeliveryChoiceMongo = await DeliveryChoiceMongo.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedDeliveryChoiceMongo) {
        throw new NotFound();
      }

      // Mise à jour de la commande dans SQL
      const updatedDeliveryChoiceSQL = await DeliveryChoice.update(updateData, {
        where: { id},
        transaction: t,
        returning: true,
      });

      if (updatedDeliveryChoiceSQL[0] === 0) {
        throw new NotFound();
      }

      return updatedDeliveryChoiceSQL[1][0]; // retourne la commande mise à jour
    });

    return res.status(204);
  } catch (error) {
    return next(error);
  }
}

async function deleteDeliveryChoice(req, res, next) {
  try {
    const id = req.params.id;

    // Commencer une transaction SQL
    const result = await sequelize.transaction(async (t) => {
      // Suppression de la commande dans MongoDB
      const deletedDeliveryChoiceMongo = await DeliveryChoiceMongo.findByIdAndDelete(id);

      if (!deletedDeliveryChoiceMongo) {
        throw new NotFound();
      }

      // Suppression de la commande dans SQL
      const deletedDeliveryChoiceSQL = await DeliveryChoice.destroy({
        where: { id },
        transaction: t,
      });

      if (deletedDeliveryChoiceSQL === 0) {
        throw new NotFound();
      }

      return deletedDeliveryChoiceMongo; 
    });

    return res.status(204);
  } catch (error) {
    
    return next(error);
  }
}
module.exports = {
  createDeliveryChoice,
  getDeliveryChoices,
  getDeliveryChoice,
  updateDeliveryChoice,
  deleteDeliveryChoice,
};
