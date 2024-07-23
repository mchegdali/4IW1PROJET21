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
    return res.json({
      newProductAlert: req.user.newProductAlert,
      restockAlert: req.user.restockAlert,
      priceChangeAlert: req.user.priceChangeAlert,
      newsletterAlert: req.user.newsletterAlert,
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
    const userId = req.user.id;

    const { newProductAlert, restockAlert, priceChangeAlert, newsletterAlert } =
      userAlertsUpdateSchema.parse(req.body);

    const user = await Users.findByPk(userId);
    const alertValues = {
      newProductAlert: user.getDataValue('newProductAlert'),
      restockAlert: user.getDataValue('restockAlert'),
      priceChangeAlert: user.getDataValue('priceChangeAlert'),
      newsletterAlert: user.getDataValue('newsletterAlert'),
    };

    if (!user) {
      return res.sendStatus(404);
    }

    const changedMap = new Map();
    if (newProductAlert !== alertValues.newProductAlert) {
      user.newProductAlert = newProductAlert;
      changedMap.set('newProductAlert', newProductAlert);
    }

    if (restockAlert !== alertValues.restockAlert) {
      user.restockAlert = restockAlert;
      changedMap.set('restockAlert', restockAlert);
    }

    if (priceChangeAlert !== alertValues.priceChangeAlert) {
      user.priceChangeAlert = priceChangeAlert;
      changedMap.set('priceChangeAlert', priceChangeAlert);
    }

    if (newsletterAlert !== alertValues.newsletterAlert) {
      user.newsletterAlert = newsletterAlert;
      changedMap.set('newsletterAlert', newsletterAlert);
    }

    if (changedMap.size === 0) {
      return res.sendStatus(204);
    }

    await user.save();

    let brevoContactResponse;

    try {
      brevoContactResponse = await apiInstance.getContactInfo(req.user.email);
    } catch (error) {
      if (error instanceof brevo.HttpError && error.statusCode === 404) {
        brevoContactResponse = await apiInstance.createContact({
          email: req.user.email,
        });
      } else {
        throw error;
      }
    }

    /**
     * @type {import('@getbrevo/brevo').GetExtendedContactDetails | import('@getbrevo/brevo').CreateUpdateContactModel}
     */
    const body = brevoContactResponse.body;

    console.log(req.user.email, 'body.id', body.id);

    const listUpdatePromises = [];

    for (const alertType in listIds) {
      const hasChanged = changedMap.has(alertType);

      if (hasChanged) {
        const listId = listIds[alertType];
        const isAdded = !!user.getDataValue(alertType);

        if (isAdded) {
          let contactEmails = new brevo.AddContactToList();
          contactEmails.ids = [body.id];
          listUpdatePromises.push(
            apiInstance.addContactToList(listId, contactEmails),
          );
        } else {
          let contactEmails = new brevo.RemoveContactFromList();
          contactEmails.ids = [body.id];
          listUpdatePromises.push(
            apiInstance.removeContactFromList(listId, contactEmails),
          );
        }
      }
    }

    const listUpdateResponses = await Promise.all(listUpdatePromises);

    for (const { response, body } of listUpdateResponses) {
      console.table(body);
      if (response.statusCode === 200) {
        console.log('Successfully updated list');
      } else {
        console.log('Failed to update list');
      }
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

module.exports = {
  getAlerts,
  updateAlerts,
};
