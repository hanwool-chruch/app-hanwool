import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import logger from '../../config/logger';
import { Request } from 'express';
import { jwtSecret, googleCredentials } from '../../config/consts';
import { checkUser } from '../../controller/user-controller';

const jwtFromRequest = (req: Request) => {
	let token = null;
	if (req && req.cookies) {
		token = req.cookies['authorization'];
	}
	return token;
};
const secretOrKey = jwtSecret;
const opts = { jwtFromRequest, secretOrKey };

const jwt = new JwtStrategy(opts, (jwt_payload: any, done) => {
	logger.info('JWT BASED AUTH GETTING CALLED');
	if (checkUser(jwt_payload.data)) {
		return done(null, jwt_payload.data);
	} else {
		return done(null, false);
	}
});

const google = new GoogleStrategy(
	{
		clientID: googleCredentials.clientId,
		clientSecret: googleCredentials.clientSecret,
		callbackURL: '/api/google/redirect',
	},
	(accessToken, refreshToken, profile, done: Function) => {
		logger.debug(accessToken, refreshToken, profile);
		logger.info('GOOGLE BASED OAUTH VALIDATION GETTING CALLED');
		return done(null, profile);
	}
);

passport.serializeUser((user, done) => {
	logger.debug('serializeUser');
	done(null, user);
});
passport.deserializeUser((obj, done) => {
	logger.debug('deserializeUser');
	done(null, obj);
});

export default { jwt, google };
