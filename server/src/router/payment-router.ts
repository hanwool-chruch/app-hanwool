import { Router } from 'express';
import { PaymentController } from '../controller';

const paymentRouter = Router();
paymentRouter.post('/', PaymentController.create);
paymentRouter.get('/', PaymentController.findByServiceId);

export default paymentRouter;
