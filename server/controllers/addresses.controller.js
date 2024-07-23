const UserMongo = require('../models/mongo/user.mongo');
const sequelize = require('../models/sql');

const {
  addressCreateSchema,
  addressUpdateSchema,
} = require('../schemas/addresses.schema');

const Addresses = sequelize.model('addresses');

/**
 * @type {import('express').RequestHandler}
 */
async function createAddress(req, res, next) {
  try {
    const userId = req.params.userId;
    const addressData = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ error: 'User ID is required in the request body' });
    }

    const addressCreateBody = await addressCreateSchema.parseAsync(addressData);
    console.log('ryio', addressCreateBody);
    const createdAddress = await Addresses.create({
      ...addressCreateBody,
      userId: userId,
    });

    const user = await UserMongo.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newAddress = {
      _id: createdAddress.id,
      ...addressCreateBody,
    };

    user.addresses.push(newAddress);
    await user.save();

    return res.status(201).json(newAddress);
  } catch (error) {
    return next(error);
  }
}

async function getAddresses(req, res, next) {
  try {
    const user = await UserMongo.findById(req.params.userId).lean({});

    if (user === null) {
      return res.sendStatus(404);
    }

    return res.json(user.addresses);
  } catch (error) {
    return next(error);
  }
}

async function getAddress(req, res, next) {
  try {
    const filter = {
      _id: req.params.userId,
      'addresses._id': req.params.id,
    };

    const user = await UserMongo.findOne(filter);

    if (!user) {
      return res.sendStatus(404);
    }

    const address = user.addresses.id(req.params.id);

    return res.json(address);
  } catch (error) {
    return next(error);
  }
}

/**
 * @type {import('express').RequestHandler}
 */
async function updateAddress(req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const addressUpdateBody = await addressUpdateSchema.parseAsync(req.body);
    const addressId = req.params.id;
    const userId = req.params.userId;

    const user = await UserMongo.findOne({
      'addresses._id': addressId,
      _id: userId,
    });

    const sqlAddress = await Addresses.findByPk(addressId, { transaction });

    if (!user || !sqlAddress) {
      await transaction.rollback();
      return res.sendStatus(404);
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      await transaction.rollback();
      return res.sendStatus(404);
    }

    address.set(addressUpdateBody);
    await user.save();

    await sqlAddress.update(addressUpdateBody, { transaction });

    await transaction.commit();
    return res.status(200).json(address);
  } catch (error) {
    await transaction.rollback();
    return next(error);
  }
}

async function deleteAddress(req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const addressId = req.params.id;
    const userId = req.params.userId;

    const user = await UserMongo.findOne({
      'addresses._id': addressId,
      _id: userId,
    });

    if (!user) {
      return res.sendStatus(404);
    }

    const userUpdateResult = await UserMongo.updateOne(
      { 'addresses._id': addressId, _id: userId },
      { $pull: { addresses: { _id: addressId } } },
    );

    if (!userUpdateResult || userUpdateResult.modifiedCount === 0) {
      return res.sendStatus(404);
    }

    const deletedCountSql = await Addresses.destroy({
      where: { id: addressId },
      transaction,
    });

    if (deletedCountSql === 0) {
      return res.sendStatus(404);
    }

    await transaction.commit();
    return res.sendStatus(204);
  } catch (error) {
    await transaction.rollback();
    return next(error);
  }
}

/**
 * @type {import('express').RequestHandler}
 */
async function replaceAddress(req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const addressId = req.params.id;
    const userId = req.params.userId;

    const addressUpdateBody = await addressCreateSchema.parseAsync(req.body);

    const user = await UserMongo.findOne({
      'addresses._id': addressId,
      _id: userId,
    });
    const sqlAddress = await Addresses.findByPk(addressId, { transaction });

    if (!user || !sqlAddress) {
      await transaction.rollback();
      return res.sendStatus(404);
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      await transaction.rollback();
      return res.sendStatus(404);
    }
    address.set(addressUpdateBody);
    await user.save();

    await sqlAddress.update(addressUpdateBody, { transaction });

    await transaction.commit();
    return res.status(200).json(address);
  } catch (error) {
    await transaction.rollback();
    return next(error);
  }
}

module.exports = {
  createAddress,
  getAddresses,
  getAddress,
  updateAddress,
  replaceAddress,
  deleteAddress,
};
