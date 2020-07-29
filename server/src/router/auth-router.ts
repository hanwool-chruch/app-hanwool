import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controller';

const authRouter = Router();
authRouter.post('/email', AuthController.emailLogin);
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRouter.get('/google/redirect', passport.authenticate('google'), AuthController.googleRedirect);

export default authRouter;
