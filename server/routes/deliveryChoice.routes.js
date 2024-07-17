const { Router } = require('express');
const {
  createDeliveryChoice,
  deleteDeliveryChoice,
  getDeliveryChoice,
  getDeliveryChoices,
  updateDeliveryChoice,
} = require('../controllers/deliveryChoice.controller');


const deliveryChoiceRouter = Router();




deliveryChoiceRouter
  .route('/delivery-choices/:id')
  .get(getDeliveryChoice)
  .patch(updateDeliveryChoice)
  .delete(deleteDeliveryChoice);

deliveryChoiceRouter.route('/delivery-choices').get(getDeliveryChoices).post(createDeliveryChoice);

module.exports = deliveryChoiceRouter;
