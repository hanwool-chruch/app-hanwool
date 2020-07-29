import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status';
import { JsonResponse } from '../modules/util';
import userController from './user-controller';
import { User } from '../model';
import jwt from 'jsonwebtoken';
import { jwtSecret, tokenExpiresIn, web_host } from '../config/consts';
import logger from '../config/logger';
import CustomError from '../exception/custom-error';

const emailLogin = (req: Request, res: Response, next: NextFunction) => {
	try {
		const isValidUser = userController.checkUserPassword(req.body);
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

const emailSignUp = async (req: Request, res: Response, next: NextFunction) => {
	const { query } = req;
	logger.debug('query: ', query);
	try {
		const users = await User.findByEmail(query.email as string);
		const existsEmailUser = users.filter((user) => user?.provider === 'email');
		if (existsEmailUser) {
			throw new CustomError(HttpStatus.BAD_REQUEST, `already exists email ${query.email}`);
		} else {
			query.provider = 'email';
			if (users.length !== 0) {
				const user = users[0];
				delete user?.provider;
				query.user_id = user?.user_id.toString(); //user_id 는 number라서 테스트 필요
				const emailUser = await User.registerUser(query as any, 'email_user');
				res
					.status(HttpStatus.CREATED)
					.json(JsonResponse(`created user success email(${query.email})`, { user, emailUser }));
			} else {
				const user = await User.registerUser(query as any, 'user');
				query.user_id = user?.user_id.toString(); //user_id 는 number라서 테스트 필요
				const emailUser = await User.registerUser(query as any, 'email_user');
				res
					.status(HttpStatus.CREATED)
					.json(JsonResponse(`created user success email(${query.email})`, { user, emailUser }));
			}
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

	userController.findOrCreate(user, 'google');
	const token = jwt.sign(
		{
			data: user,
		},
		jwtSecret,
		{ expiresIn: tokenExpiresIn }
	);
	res.cookie('authorization', token);
	res.redirect(web_host);
};

export default { emailSignUp, emailLogin, googleRedirect };
