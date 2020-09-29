import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status';
import { JsonResponse } from '../modules/util';
import userController from './user-controller';
import { User, Service } from '../model';
import jwt from 'jsonwebtoken';
import { jwtSecret, tokenExpiresIn, githubCredentials } from '../config/consts';
import CustomError from '../exception/custom-error';
import crypto from 'crypto';
import { UserDto } from '@shared/dto';
import { TOKEN_USER } from '@shared/dto/user-dto';

const emailLogin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const isValidUser = await userController.checkUserPassword(req.body);
		if (isValidUser) {
			const user = await User.findById(isValidUser.user_id);
			const token = jwt.sign(
				{
					data: user,
				},
				jwtSecret,
				{ expiresIn: tokenExpiresIn }
			);
			res
				.cookie('authorization', token, {
					// 1시간 뒤 만료
					expires: new Date(Date.now() + 60 * 60 * 1000),
				})
				.status(HttpStatus.OK)
				.json(
					JsonResponse(`Log in success ${req.body.email}`, {
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
	body.password = crypto.createHash('sha256').update(body.password).digest('base64');
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
					.cookie('authorization', token, {
						// 1시간 뒤 만료
						expires: new Date(Date.now() + 60 * 60 * 1000),
					})
					.status(HttpStatus.CREATED)
					.json(JsonResponse(`created user success email(${body.email})`, { user }));
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
					.cookie('authorization', token, {
						// 1시간 뒤 만료
						expires: new Date(Date.now() + 60 * 60 * 1000),
					})
					.status(HttpStatus.CREATED)
					.json(JsonResponse(`created user success email(${body.email})`, { user }));
			}
		}
	} catch (err) {
		return next(err);
	}
};

const googleRedirect = async (req: Request, res: Response, next: NextFunction) => {
	const googleUser: any = req.user;
	const tokenUser = {
		user_id: googleUser.id,
		name: googleUser.displayName,
		email: googleUser._json.email,
		provider: googleUser.provider,
	};

	const { user, serviceId } = await userController.findOrCreate(tokenUser, 'google');
	const token = jwt.sign(
		{
			data: user,
		},
		jwtSecret,
		{ expiresIn: tokenExpiresIn }
	);

	const hashedServiceId = (serviceId + 3000).toString(16);
	const now = new Date();
	const yearAndMonth = `${now.getFullYear()}-${now.getMonth() + 1}`;
	res.cookie('authorization', token, {
		// 1시간 뒤 만료
		expires: new Date(Date.now() + 60 * 60 * 1000),
	});
	res.redirect(`/${hashedServiceId}/${yearAndMonth}/history`);
};

const githubRedirect = async (req: Request, res: Response, next: NextFunction) => {
	const githubUser: any = req.user;

	const tokenUser = {
		user_id: githubUser.id,
		name: githubUser.displayName,
		email: githubUser.username,
		provider: githubUser.provider,
	};

	const { user, serviceId } = await userController.findOrCreate(tokenUser, 'github');
	const token = jwt.sign(
		{
			data: user,
		},
		jwtSecret,
		{ expiresIn: tokenExpiresIn }
	);

	const now = new Date();
	const yearAndMonth = `${now.getFullYear()}-${now.getMonth() + 1}`;
	res.cookie('authorization', token, {
		// 1시간 뒤 만료
		expires: new Date(Date.now() + 60 * 60 * 1000),
	});
	res.redirect(`/${(serviceId + 3000).toString(16)}/${yearAndMonth}/history`);
};

const isValidToken = async (req: Request, res: Response, next: NextFunction) => {
	if (req.user) {
		const tokenUser = req.user as TOKEN_USER;

		res
			.status(HttpStatus.OK)
			.json(JsonResponse('valid token user', { serviceId: tokenUser.service_id }));
	} else res.status(HttpStatus.UNAUTHORIZED).json(JsonResponse('expired token', {}));
};

export default { emailSignUp, emailLogin, googleRedirect, isValidToken, githubRedirect };
