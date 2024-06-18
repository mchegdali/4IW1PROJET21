import { Router } from 'express';
import {createShipping,getAllShipping,getShipping} from '../controllers/shipping.controller.js';

const shippingRouter = Router();
shippingRouter.route('/:id').get(getShipping);
shippingRouter.route('/').post(createShipping).get(getAllShipping);
export default shippingRouter;