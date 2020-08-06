import { Router } from 'express';
import { CategoryController } from '../controller';

const categoryRouter = Router();
categoryRouter.post('/', CategoryController.create);
categoryRouter.get('/:id', CategoryController.findByServiceId);

export default categoryRouter;
