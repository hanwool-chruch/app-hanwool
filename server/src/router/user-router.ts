import { Router } from 'express';
import { UserController } from '../controller';

const userRouter = Router();
userRouter.get('/:user_id', UserController.findUserById);

export default userRouter;
