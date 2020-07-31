import userRouter from './user-router';
import authRouter from './auth-router';
import serviceRouter from './service-router';
import categoryRouter from './category-router';
import paymentRouter from './payment-router';
import { Router, Request, Response, NextFunction } from 'express';

const router = Router();
router.route('/').get((req: Request, res: Response, next: NextFunction) => {
	res.render('index');
});

export { router, userRouter, authRouter, serviceRouter, categoryRouter, paymentRouter };
