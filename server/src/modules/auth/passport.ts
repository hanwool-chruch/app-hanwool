import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GithubStrategy } from 'passport-github';
import logger from '../../config/logger';
import { Request } from 'express';
import { jwtSecret, googleCredentials, githubCredentials } from '../../config/consts';
import userController from '../../controller/user-controller';

const jwtFromRequest = (req: Request) => {
	let token = null;
	if (req && req.headers.authorization) {
		token = req.headers.authorization;
		token = token.replace('Basic ', '');
	}
	return token;
};
const secretOrKey = jwtSecret;
const opts = { jwtFromRequest, secretOrKey };

const jwt = new JwtStrategy(opts, (jwt_payload: any, done) => {
	logger.info('JWT BASED AUTH GETTING CALLED');
	if (userController.isExistsUser(jwt_payload.data)) {
		return done(null, jwt_payload.data);
	} else {
		return done(null, false);
	}
});

const google = new GoogleStrategy(
	{
		clientID: googleCredentials.clientId,
		clientSecret: googleCredentials.clientSecret,
		callbackURL: '/api/auth/google/redirect',
	},
	(accessToken, refreshToken, profile, done: Function) => {
		console.info('GOOGLE BASED OAUTH VALIDATION GETTING CALLED');
		return done(null, profile);
	}
);

const github = new GithubStrategy(
	{
		clientID: githubCredentials.clientId,
		clientSecret: githubCredentials.clientSecret,
		callbackURL: '/api/auth/github/redirect',
	},
	function (accessToken, refreshToken, profile, done: Function) {
		console.info('GITHUB BASED OAUTH VALIDATION GETTING CALLED');
		done(null, profile);
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

export default { jwt, google, github };
