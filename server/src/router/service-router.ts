import { Router } from 'express';
import { ServiceController } from '../controller';

const serviceRouter = Router();
serviceRouter.post('/', ServiceController.create);
serviceRouter.get('/:id', ServiceController.findById);

export default serviceRouter;
