import { Router } from 'express';
import { PaymentController } from '../controller';

const paymentRouter = Router();
paymentRouter.post('/', PaymentController.create);
paymentRouter.get('/:id', PaymentController.findByServiceId);
paymentRouter.post('/bulk', PaymentController.bulkInsert);

export default paymentRouter;
