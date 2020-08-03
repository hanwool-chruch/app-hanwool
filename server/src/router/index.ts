import { Router, Request, Response, NextFunction } from 'express';
import userRouter from './user-router';
import authRouter from './auth-router';
import serviceRouter from './service-router';
import categoryRouter from './category-router';
import paymentRouter from './payment-router';

const router = Router();

router.use('/api/user', userRouter);
router.use('/api/auth', authRouter);
router.use('/api/service', serviceRouter);
router.use('/api/category', categoryRouter);
router.use('/api/payment', paymentRouter);
router.use((req: Request, res: Response, next: NextFunction) => {
	res.render('index');
});

export default router;
