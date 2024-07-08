const DeliveryChoiceMongo = require('../models/mongo/deliveryChoice.mongo');
const sequelize = require('../models/sql/db');
const { NotFound } = require('http-errors');
const ShippingMongo = require('../models/mongo/shipping.mongo');
const DeliveryChoiceSequelize = sequelize.model('deliveryChoices');

const {
  deliveryChoiceCreateSchema,
  deliveryChoiceUpdateSchema,
} = require('../schemas/deliveryChoice.schema');


/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function createDeliveryChoice(req, res, next) {
  try {
    // Valider le corps de la requête
    const deliveryChoiceCreateBody = await deliveryChoiceCreateSchema.parseAsync(req.body);
    console.log(deliveryChoiceCreateBody);
    if (!deliveryChoiceCreateBody.name) {
      throw new Error('Le champ "name" est requis');
    }
    // Démarrer une transaction avec Sequelize
    const result = await sequelize.transaction(async (t) => {
      // Créer un enregistrement dans la base de données SQL avec la transaction
      const shipping = await DeliveryChoiceSequelize.create(deliveryChoiceCreateBody, {
        transaction: t,
      });

      // Créer un document dans MongoDB en utilisant l'ID de l'enregistrement SQL comme _id
      const deliveryChoiceDoc = await DeliveryChoiceMongo.create({
        _id: shipping.id.toString(), // Assurez-vous que l'ID est compatible avec MongoDB ObjectID si nécessaire
        name: shipping.name,
      });

      return deliveryChoiceDoc;
    });

    // Retourner le document créé avec un statut 201 (Created)
    return res.status(201).json(result);
  } catch (error) {
    // Passer l'erreur au middleware de gestion des erreurs
    return next(error);
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function getDeliveryChoice(req, res, next) {
  try {
    const deliveryChoice = await DeliveryChoiceMongo.find({}).lean({});
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
    /**
     * @type {boolean}
     */
    const isUUID = req.params.id;

    const filter = {
      isUUID,
    };

    const deliveryChoice = await DeliveryChoiceMongo.findOne(filter).lean();

    if (!deliveryChoice) {
      return res.sendStatus(404);
    }

    return res.json(deliveryChoice);
  } catch (error) {
    return next(error);
  }
}

/**
 * @type {import('express').RequestHandler}
 */
async function updateDeliveryChoice(req, res, next) {
  console.log(req.params.id);
  try {
    const id = req.params.id;
    const sqlWhere = {
      id ,
    };
    const mongoWhere = {
      id,
    };

    const deliveryChoiceUpdateBody = deliveryChoiceUpdateSchema.parse(req.body);
    const updatedKeys = Object.keys(deliveryChoiceUpdateBody);

    const result = await sequelize.transaction(async (t) => {
      const [affectedRowsCount, affectedRows] =
        await DeliveryChoiceSequelize.update(deliveryChoiceUpdateBody, {
          where: sqlWhere,
          limit: 1,
          transaction: t,
          returning: true,
        });

      if (affectedRowsCount === 0) {
        throw new NotFound();
      }

      const deliveryChoice = await DeliveryChoiceSequelize.scope('toMongo').findByPk(
        affectedRows[0].getDataValue('id'),
        {
          transaction: t,
        },
      );

      const deliveryChoiceMongo = {};

      for (const key of updatedKeys) {
        deliveryChoiceMongo[key] = deliveryChoice.getDataValue(key);
      }

      const deliveryChoiceDoc = await DeliveryChoiceMongo.findOneAndUpdate(
        mongoWhere,
        deliveryChoiceMongo,
        {
          new: true,
        },
      );

      if (!deliveryChoiceDoc) {
        throw new NotFound();
      }

      await ShippingMongo.updateMany(
        {
          'deliveryChoice._id': deliveryChoiceDoc._id,
        },
        {
          $set: {
            deliveryChoice: deliveryChoiceDoc,
          },
        },
      );

      return deliveryChoiceDoc;
    });

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function deleteDeliveryChoice(req, res, next) {
  try {
    const isUUID = req.params.id;

    const sqlWhere = {
      isUUID,
    };
    const mongoWhere = {
      isUUID,
    };

    const [deletedCountSql, deletedCountMongo] = await Promise.all([
      DeliveryChoiceSequelize.destroy({ where: sqlWhere }),
      DeliveryChoiceMongo.deleteOne(mongoWhere),
    ]);

    if (deletedCountSql === 0 && deletedCountMongo.deletedCount === 0) {
      return res.sendStatus(404);
    }

    await ShippingMongo.updateMany(
      {
        deliveryChoice: mongoWhere,
      },
      {
        $set: {
          deliveryChoice: null,
        },
      },
    );

    return res.sendStatus(204);
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
