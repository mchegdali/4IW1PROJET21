import { Router } from 'express';
import {createShipping,getShipping} from '../controllers/shipping.controller.js';

const shippingRouter = Router();
shippingRouter.route('/:id').get(getShipping);
shippingRouter.route('/').post(createShipping).get((req,res)=> {
    return res.status(200).send('get   livraison')
});

export default shippingRouter;