import { Router } from 'express';
import {createLivraison,getLivraison} from '../controllers/livraison.controller.js';

const livraisonRouter = Router();

livraisonRouter.route('/:livraison').get(getLivraison);
livraisonRouter.route('/livraison').post(createLivraison);

export default livraisonRouter;