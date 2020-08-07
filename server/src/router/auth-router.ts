import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controller';

const authRouter = Router();
authRouter.get('/', passport.authenticate('jwt'), AuthController.isValidToken);
authRouter.post('/email', AuthController.emailLogin);
authRouter.post('/email/signup', AuthController.emailSignUp);
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRouter.get('/google/redirect', passport.authenticate('google'), AuthController.googleRedirect);
authRouter.get('/github', passport.authenticate('github', { scope: ['profile', 'email'] }));
authRouter.get('/github/redirect', passport.authenticate('github'), AuthController.githubRedirect);

export default authRouter;
