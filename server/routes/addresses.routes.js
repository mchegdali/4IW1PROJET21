const { Router } = require('express');
const {
  createAddress,
  deleteAddress,
  updateAddress,
  getAddresses,
  getAddress,
  replaceAddress,
} = require('../controllers/addresses.controller');

const addressesRouter = Router({ mergeParams: true });

addressesRouter.post('/', createAddress);

addressesRouter.patch('/:id', updateAddress);

addressesRouter.put('/:id', replaceAddress);

addressesRouter.delete('/:id', deleteAddress);

addressesRouter.get('/', getAddresses);
addressesRouter.get('/:id', getAddress);

module.exports = addressesRouter;
