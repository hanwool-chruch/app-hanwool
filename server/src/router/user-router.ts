import { Router } from 'express';
import { UserController } from '../controller';

const userRouter = Router();
userRouter.get('/:id', UserController.findById);
userRouter.get('/', UserController.findAll);

export default userRouter;
