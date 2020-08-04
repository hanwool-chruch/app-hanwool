import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status';
import { History } from '../model';
import { JsonResponse } from '../modules/util';
import logger from '../config/logger';
import { HistoryDto } from '@shared/dto';

/**
 * @api {post} /service Request Service create
 * @apiName create
 * @apiGroup Service
 *
 * @apiParam {Number} user_id User unique ID.
 *
 * @apiSuccess {Number} service_id service id of the Service.
 * @apiSuccess {String} service_name  service name of the Service.
 * @apiSuccess {Date} create_date create date of the Service.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status": 200,
 *       "message": "service created(${service_name})"
 *       "result": {
 *                      "service_id": 1,
 *                      "service_name": "woowahan service",
 *                      "create_date": "2020-01-01"
 *                 }
 *     }
 *
 * @apiError NoServiceForUser Service was not found with user_id.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *        "status": 400,
 *        "message": "no service for user ${user_id}"
 *        "result": {
 *                      "error": "No Service for ${user_id}"
 *                  }
 *     }
 */
const create = async (req: Request, res: Response, next: NextFunction) => {
	const { body } = req;

	try {
		const history = await History.create(body as any);
		if (history) {
			res
				.status(HttpStatus.CREATED)
				.json(JsonResponse(`history created(${history.content})`, history));
		} else {
			res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json(JsonResponse('internal server error', null));
		}
	} catch (err) {
		next(err);
	}
};

const findByMonth = async (req: Request, res: Response, next: NextFunction) => {
	const { query } = req;

	try {
		const history = await History.findByMonth(query as any);
		if (history.length) {
			res
				.status(HttpStatus.OK)
				.json(JsonResponse(`got histories by month ${query.startDate}`, history));
		} else {
			res
				.status(HttpStatus.BAD_REQUEST)
				.json(JsonResponse(`no histories by month ${query.startDate}`, null));
		}
	} catch (err) {
		next(err);
	}
};

const update = async (req: Request, res: Response, next: NextFunction) => {
	const { body } = req;

	try {
		const history = await History.update(body as any);
		if (history) {
			res.status(HttpStatus.OK).json(JsonResponse(`updated history ${body.history_id}`, history));
		} else {
			res
				.status(HttpStatus.BAD_REQUEST)
				.json(JsonResponse(`updated history ${body.history_id}`, null));
		}
	} catch (err) {
		next(err);
	}
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
	const { body } = req;

	try {
		const history = await History.remove(body as any);
		if (history) {
			res.status(HttpStatus.OK).json(JsonResponse(`removed history ${body.history_id}`, history));
		} else {
			res
				.status(HttpStatus.BAD_REQUEST)
				.json(JsonResponse(`removed history ${body.history_id}`, null));
		}
	} catch (err) {
		next(err);
	}
};

export default { create, findByMonth, update, remove };
