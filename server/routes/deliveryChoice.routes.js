const { Router } = require('express');
const {
  createDeliveryChoice,
  deleteDeliveryChoice,
  getDeliveryChoice,
  getDeliveryChoices,
  updateDeliveryChoice,
} = require('../controllers/deliveryChoice.controller');

const { getShipping } = require('../controllers/shipping.controller');

const deliveryChoiceRouter = Router();



deliveryChoiceRouter.get('/deliveryChoices/:deliveryChocie/shipping', getShipping);

deliveryChoiceRouter
  .route('/deliveryChoices/:deliveryChocie')
  .get(getDeliveryChoice)
  .patch(updateDeliveryChoice)
  .delete(deleteDeliveryChoice);

deliveryChoiceRouter.route('/deliveryChoices').get(getDeliveryChoices).post(createDeliveryChoice);

module.exports = deliveryChoiceRouter;
