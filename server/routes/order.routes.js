const { Router } = require('express');
const {
  createOrder,
  deleteOrder,
  getOrder,
  getOrders,
  updateOrder,
} = require('../controllers/order.controller');

const orderRouter = Router();



// basketRouter.get('/deliveryChoices/:id/shipping', getShipping);
orderRouter.route('/order/test').get(getOrder, (req, res) => {
  res.send('Basket resulat ')
})
orderRouter
  .route('/order/:id')
  .get(getOrder)
  .patch(updateOrder)
  .delete(deleteOrder);

orderRouter.route('/order').get(getOrders).post(createOrder);

module.exports = orderRouter;