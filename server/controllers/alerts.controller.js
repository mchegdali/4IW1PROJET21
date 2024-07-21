const User = require('../models/user.model');
const brevo = require('@getbrevo/brevo');
const sequelize = require('../models/sql');

const Users = sequelize.models.users;

let apiInstance = new brevo.ContactsApi();
let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

// Updated list IDs
const listIds = {
  newProductAlert: '4',
  restockAlert: '5',
  priceChangeAlert: '6',
  newsletterAlert: '7',
};

/**
 *
 * @type {import('express').RequestHandler}
 */
const getAlerts = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    return res.json({
      newProductAlert: user.newProductAlert,
      restockAlert: user.restockAlert,
      priceChangeAlert: user.priceChangeAlert,
      newsletterAlert: user.newsletterAlert,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 *
 * @type {import('express').RequestHandler}
 */
const updateAlerts = async (req, res, next) => {
  try {
    const responseBody = await sequelize.transaction(async (transaction) => {
      const user = await Users.findByPk(req.params.userId, { transaction });
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      const {
        newProductAlert,
        restockAlert,
        priceChangeAlert,
        newsletterAlert,
      } = req.body;

      user.newProductAlert = newProductAlert ?? user.newProductAlert;
      user.restockAlert = restockAlert ?? user.restockAlert;
      user.priceChangeAlert = priceChangeAlert ?? user.priceChangeAlert;
      user.newsletterAlert = newsletterAlert ?? user.newsletterAlert;

      const savedUser = await user.save({ transaction });

      const listUpdatePromises = [];

      for (let alertType in listIds) {
        if (savedUser[alertType]) {
          listUpdatePromises.push(
            apiInstance.addContactToList(listIds[alertType], {
              emails: [user.email],
            }),
          );
        } else {
          listUpdatePromises.push(
            apiInstance.removeContactFromList(listIds[alertType], {
              emails: [user.email],
            }),
          );
        }
      }

      await Promise.all(listUpdatePromises);

      return {
        newProductAlert: savedUser.newProductAlert,
        restockAlert: savedUser.restockAlert,
        priceChangeAlert: savedUser.priceChangeAlert,
        newsletterAlert: savedUser.newsletterAlert,
      };
    });

    return res.json(responseBody);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAlerts,
  updateAlerts,
};
