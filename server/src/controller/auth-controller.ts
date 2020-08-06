import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status';
import { JsonResponse } from '../modules/util';
import userController from './user-controller';
import { User, Service } from '../model';
import jwt from 'jsonwebtoken';
import { jwtSecret, tokenExpiresIn } from '../config/consts';
import logger from '../config/logger';
import CustomError from '../exception/custom-error';

const emailLogin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const isValidUser = await userController.checkUserPassword(req.body);
		if (isValidUser) {
			delete isValidUser.password;
			const token = jwt.sign(
				{
					data: isValidUser,
				},
				jwtSecret,
				{ expiresIn: tokenExpiresIn }
			);
			res.status(HttpStatus.OK).json(
				JsonResponse(`Log in success ${req.body.email}`, {
					token,
					serviceId: isValidUser.service_id,
				})
			);
		} else {
			res.status(HttpStatus.BAD_REQUEST).json(JsonResponse('Invalid login credentials', {}));
		}
	} catch (err) {
		return next(err);
	}
};

const emailSignUp = async (req: Request, res: Response, next: NextFunction) => {
	const { body } = req;

	try {
		const users = await User.findByEmail(body.email as string);
		const existsEmailUser = users.filter((user) => user?.provider === 'email');
		if (existsEmailUser.length) {
			throw new CustomError(HttpStatus.BAD_REQUEST, `already exists email ${body.email}`);
		} else {
			if (users.length !== 0) {
				const user = users[0];
				const dataForEmailUser = {
					email: body.email,
					password: body.password,
					user_id: user?.user_id,
					provider: 'email',
				};
				await User.registerUser(dataForEmailUser as any, 'email_user');
				const token = jwt.sign(
					{
						data: user,
					},
					jwtSecret,
					{ expiresIn: tokenExpiresIn }
				);
				res
					.status(HttpStatus.CREATED)
					.json(JsonResponse(`created user success email(${body.email})`, { user, token }));
			} else {
				const service = await Service.create({ service_name: body.email });
				const dataForUser = {
					email: body.email,
					name: body.name,
					image: null,
					service_id: service.service_id,
				};
				const user = await User.registerUser(dataForUser as any, 'user');

				const dataForEmailUser = {
					email: body.email,
					password: body.password,
					user_id: user?.user_id,
					provider: 'email',
				};
				await User.registerUser(dataForEmailUser as any, 'email_user');

				const token = jwt.sign(
					{
						data: user,
					},
					jwtSecret,
					{ expiresIn: tokenExpiresIn }
				);
				res
					.status(HttpStatus.CREATED)
					.json(JsonResponse(`created user success email(${body.email})`, { user, token }));
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
	res.redirect('/');
};

const isValidToken = (req: Request, res: Response, next: NextFunction) => {
	if (req.user) res.sendStatus(HttpStatus.OK);
	else res.sendStatus(HttpStatus.UNAUTHORIZED);
};

export default { emailSignUp, emailLogin, googleRedirect, isValidToken };
