import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status';
import { JsonResponse } from '../modules/util';
import { checkUser, findOrCreate } from './user-controller';
import jwt from 'jsonwebtoken';
import { jwtSecret, tokenExpiresIn } from '../config/consts';
import logger from '../config/logger';

const emailLogin = (req: Request, res: Response, next: NextFunction) => {
	try {
		const isValidUser = checkUser(req.body);
		if (isValidUser) {
			delete req.body.password;
			let token = jwt.sign(
				{
					data: req.body,
				},
				jwtSecret,
				{ expiresIn: tokenExpiresIn }
			);
			res.cookie('authorization', token);
			res.status(HttpStatus.OK).json(JsonResponse(`Log in success ${req.body.email}`, {}));
		} else {
			res.status(HttpStatus.BAD_REQUEST).json(JsonResponse('Invalid login credentials', {}));
		}
	} catch (err) {
		return next(err);
	}
};

const googleRedirect = (req: Request, res: Response, next: NextFunction) => {
	const googleUser: any = req.user;
	logger.debug('redirected', googleUser);
	const user = {
		name: googleUser.name.displayName,
		email: googleUser._json.email,
		provider: googleUser.provider,
	};

	findOrCreate(user, 'google');
	const token = jwt.sign(
		{
			data: user,
		},
		jwtSecret,
		{ expiresIn: tokenExpiresIn }
	);
	res.cookie('authorization', token);
	res.redirect('/');
};

export { emailLogin, googleRedirect };
