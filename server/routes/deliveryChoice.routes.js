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



deliveryChoiceRouter.get('/deliveryChoices/:id/shipping', getShipping);

deliveryChoiceRouter
  .route('/deliveryChoices/:id')
  .get(getDeliveryChoice)
  .patch(updateDeliveryChoice)
  .delete(deleteDeliveryChoice);

deliveryChoiceRouter.route('/deliveryChoices').get(getDeliveryChoices).post(createDeliveryChoice);

module.exports = deliveryChoiceRouter;
