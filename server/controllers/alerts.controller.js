const User = require('../models/mongo/user.mongo');
const brevo = require('@getbrevo/brevo');
const sequelize = require('../models/sql');
const httpErrors = require('http-errors');
const { userAlertsUpdateSchema } = require('../schemas/user.schema');

const { NotFound } = httpErrors;

const Users = sequelize.models.users;

let apiInstance = new brevo.ContactsApi();
let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

// Updated list IDs
const listIds = {
  newProductAlert: 4,
  restockAlert: 5,
  priceChangeAlert: 6,
  newsletterAlert: 7,
};

/**
 *
 * @type {import('express').RequestHandler}
 */
const getAlerts = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.sendStatus(404);
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
        throw new NotFound();
      }

      const {
        newProductAlert,
        restockAlert,
        priceChangeAlert,
        newsletterAlert,
      } = userAlertsUpdateSchema.parse(req.body);

      user.newProductAlert = newProductAlert ?? user.newProductAlert;
      user.restockAlert = restockAlert ?? user.restockAlert;
      user.priceChangeAlert = priceChangeAlert ?? user.priceChangeAlert;
      user.newsletterAlert = newsletterAlert ?? user.newsletterAlert;

      const savedUser = await user.save({ transaction });

      let brevocontact;

      try {
        brevocontact = await apiInstance.getContactInfo(user.email);
      } catch (error) {
        if (error instanceof brevo.HttpError && error.statusCode === 404) {
          brevocontact = await apiInstance.createContact({
            email: user.email,
          });
        } else {
          throw error;
        }
      }

      const listUpdatePromises = [];

      for (const alertType in listIds) {
        const hasChanged = savedUser.changed(alertType);
        console.log(alertType, hasChanged);
        if (hasChanged) {
          const listId = listIds[alertType];
          if (savedUser[alertType]) {
            listUpdatePromises.push(
              apiInstance.addContactToList(listId, {
                emails: [user.email],
              }),
            );
          } else {
            listUpdatePromises.push(
              apiInstance.removeContactFromList(listId, {
                emails: [user.email],
              }),
            );
          }
        }
      }

      await Promise.allSettled(listUpdatePromises);

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
