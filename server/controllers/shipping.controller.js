const httpErrors = require('http-errors');
const sequelize = require('../models/sql');
const {
  shippingQuerySchema,
  shippingCreateSchema,
  shippingUpdateSchema,
} = require('../schemas/shipping.schema');
const { NotFound } = httpErrors;
const Shippings = sequelize.model('shippings');

const ShippingMongo = require('../models/mongo/shipping.mongo.js');
const DeliveryChoiceMongo = require('../models/mongo/deliveryChoice.mongo');
const Addresses = sequelize.model('addresses');
const AddressesMongo = require('../models/mongo/addresses.mongo.js');
/**
 *
 * @type {import('express').RequestHandler}
 * @returns
 */
async function createShipping(req, res, next) {
  try {
    const shippingCreateBody = await shippingCreateSchema.parseAsync(req.body);
    console.log("Parsed shipping request body:", shippingCreateBody);

    const result = await sequelize.transaction(async (t) => {
     
      const addressData = shippingCreateBody.address;
      console.log("Address data to be created:", addressData);

      const address = await Addresses.create(addressData, { transaction: t });
      console.log("Created address in SQL database:", address);

      const addressMongo = {
        _id: address.id,
        firstName: addressData.firstName,
        lastName: addressData.lastName,
        country: addressData.country,
        region: addressData.region,
        street: addressData.street,
        zipCode: addressData.zipCode,
        city: addressData.city,
        phone: addressData.phone,
      };
      console.log("Prepared address data for MongoDB:", addressMongo);

      const addressDoc = await AddressesMongo.create(addressMongo);
      console.log("Created address in MongoDB:", addressDoc);

    
      const deliveryChoiceId = await DeliveryChoiceMongo.findById(
        shippingCreateBody.deliveryChoice,
      );
      console.log("  shippingCreateBody.deliveryChoice ",   shippingCreateBody.deliveryChoice)
      console.log("Fetched delivery choice from MongoDB:", deliveryChoiceId);

      const shipping = await Shippings.create(
        {
          address: address.id,
          deliveryChoice: deliveryChoiceId.id,
        },
        { transaction: t },
      );
      console.log("Created shipping entry in SQL database:", shipping);
      const shippingMongo = {
        _id: shipping.id,
        address: {
          _id: address.id,
          firstName: address.firstName,
          lastName: address.lastName,
          country: address.country,
          region: address.region,
          street: address.street,
          zipCode: address.zipCode,
          city: address.city,
          phone: address.phone,
        },
        deliveryChoice: {
          _id: deliveryChoiceId._id,
          name: deliveryChoiceId.name,

        },
      };
      console.log("Created shipping entry in mongo database:", shippingMongo);
      const shippingDoc = await ShippingMongo.create(shippingMongo);
      return shippingDoc;
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error('Error creating shipping:', error);
    return next(error);
  }
}
// }
// async function createShipping(req, res, next) {
//   try {
//     const shippingCreateBody = await shippingCreateSchema.parseAsync(req.body);

//     const result = await sequelize.transaction(async (t) => {
//       const deliveryChoiceId = await DeliveryChoiceMongo.findById(
//         shippingCreateBody.deliveryChoiceId,
//       );

//       const shipping = await Shippings.create(
//         {
//           adressesId: {
//             _id: shippingCreateBody.adressesId._id,
//             fullname: shippingCreateBody.adressesId.fullname,
//             street: shippingCreateBody.adressesId.street,
//             zipCode: shippingCreateBody.adressesId.zipCode,
//             city: shippingCreateBody.adressesId.city,
//             phone: shippingCreateBody.adressesId.phone,
//           },
//           deliveryChoiceId: deliveryChoiceId._id,
//         },
//         { transaction: t },
//       );

//       const shippingMongo = {
//         _id: shipping.id,
//         adressesId: {
//           _id: shipping.adressesId._id,
//           fullname: shipping.adressesId.fullname,
//           street: shipping.adressesId.street,
//           zipCode: shipping.adressesId.zipCode,
//           city: shipping.adressesId.city,
//           phone: shipping.adressesId.phone,
//         },
//         deliveryChoiceId: deliveryChoiceId._id,
//       };

//       const shippingDoc = await ShippingMongo.create(shippingMongo);
//       return shippingDoc;
//     });

//     return res.status(201).json(result);
//   } catch (error) {
//     return next(error);
//   }
// }
//
async function getShipping(req, res, next) {
  try {
    const id = req.params.id;

    const filter = {
      _id: id,
    };

    const shipping = await ShippingMongo.findOne(filter);
    if (!shippingQuerySchema) {
      return new NotFound();
    }
    return res.json(shipping);
  } catch (error) {
    return next(error);
  }
}
async function getShippings(req, res, next) {
  try {
    const shipping = await ShippingMongo.find({}).lean({});
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

async function updateShipping(req, res, next) {
  try {
    const id = req.params.id;
    const sqlWhere = { id };
    const mongoWhere = { _id: id };

    const shippingUpdateBody = await shippingUpdateSchema.parseAsync(req.body);
    const updatedKeys = Object.keys(shippingUpdateBody);

    await sequelize.transaction(async (t) => {
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
        throw NotFound();
      }

      const order = await Shippings.findByPk(
        affectedRows[0].getDataValue('id'),
        {
          transaction: t,
        },
      );

      const shippingMongo = {};

      for (const key of updatedKeys) {
        shippingMongo[key] = order.getDataValue(key);
      }

      const replaceResult = await ShippingMongo.findOneAndUpdate(
        mongoWhere,
        shippingMongo,
        {
          new: true,
          runValidators: true,
        },
      );

      if (!replaceResult) {
        throw new NotFound();
      }

      return replaceResult;
    });

    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
}

async function deleteShipping(req, res, next) {
  try {
    const id = req.params.id;

    await sequelize.transaction(async (t) => {
      const deletedShippingMongo = await ShippingMongo.findByIdAndDelete(id);
      if (!deletedShippingMongo) {
        throw new NotFound();
      }

      const deletedCountSQL = await Shippings.destroy({
        where: id,
        transaction: t,
      });

      if (deletedCountSQL === 0) {
        throw new NotFound();
      }

      return deletedShippingMongo;
    });

    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createShipping,
  getShipping,
  updateShipping,
  deleteShipping,
  getShippings,
};
