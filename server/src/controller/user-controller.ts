import { Request, Response, NextFunction } from 'express';
import CustomError from '../exception/custom-error';
import HttpStatus from 'http-status';
import { User, Service } from '../model';
import crypto from 'crypto';
import { UserDto } from '@shared/dto';
import { TOKEN_USER } from '@shared/dto/user-dto';

/**
 * @api {get} /user/:id Request User information
 * @apiName GetUserById
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} name name of the User.
 * @apiSuccess {String} uid  user id of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": 200,
 *       "message": "get user by id '${id}'"
 *       "result": {
 *                      "name": "Jonggu Lee",
 *                      "uid": "loloara"
 *                 }
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *        "status": 404,
 *        "message": "fail to get user by id '${id}'"
 *        "result": {
 *                      "error": "UserNotFound"
 *                  }
 *     }
 */
const findById = async (req: Request, res: Response, next: NextFunction) => {};
const findAll = async (req: Request, res: Response, next: NextFunction) => {};

const isExistsUser = async (data: any): Promise<TOKEN_USER | null> => {
	try {
		if (!data.email || !data.user_id) {
			new CustomError(HttpStatus.BAD_REQUEST, 'no email or password');
		}
		const user = await User.findById(data.user_id);
		if (!user) new CustomError(HttpStatus.BAD_REQUEST, `no user email(${data.email})`);

		return data;
	} catch (err) {
		throw err;
	}
};

const checkUserPassword = async (data: any): Promise<UserDto.CHECK_PASSWORD_RESPONSE | null> => {
	try {
		if (!data.email || !data.password) {
			new CustomError(HttpStatus.BAD_REQUEST, 'no email or password');
		}
		const user = await User.findEmailUser(data.email);
		if (!user) new CustomError(HttpStatus.BAD_REQUEST, `no user email(${data.email})`);
		const hashedPassword = crypto.createHash('sha256').update(data.password).digest('base64');
		if (user?.password !== hashedPassword) throw new Error('not matched password');
		return user;
	} catch (err) {
		throw err;
	}
};

const findOrCreate = async (tokenUser: any, provider: string) => {
	try {
		const users = await User.findByEmail(tokenUser.email);
		if (users.length === 0) {
			const service = await Service.create({ service_name: tokenUser.email });
			const userBody = {
				email: tokenUser.email,
				name: tokenUser.name,
				image: null,
				service_id: service.service_id,
			};
			const user = await User.registerUser(userBody, 'user');

			const socialBody = {
				social_email: tokenUser.email,
				social_id: tokenUser.user_id,
				user_id: user.user_id,
				provider: provider,
			};
			await User.registerUser(socialBody, 'social_user');
			return { user: user, serviceId: service.service_id };
		} else {
			const socialUsers = await User.findSocialUser(tokenUser.email);
			const filteredUser = socialUsers.filter((user) => user.provider === provider);
			if (filteredUser.length) {
				return { user: users[0], serviceId: users[0].service_id };
			} else {
				const user = users[0];
				const socialBody = {
					social_email: tokenUser.email,
					social_id: tokenUser.user_id,
					user_id: user.user_id,
					provider: provider,
				};
				await User.registerUser(socialBody, 'social_user');
				return { user: user, serviceId: user.service_id };
			}
		}
	} catch (err) {
		throw err;
	}
};

export default { findById, findAll, checkUserPassword, findOrCreate, isExistsUser };
