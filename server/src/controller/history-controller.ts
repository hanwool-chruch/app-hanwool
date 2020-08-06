import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status';
import { History } from '../model';
import { JsonResponse } from '../modules/util';
import logger from '../config/logger';
import { HistoryDto } from '@shared/dto';
import { AddHistoryDto } from '@shared/dto/history-dto';

/**
 * @api {post} /api/history
 * @apiName Request creating history
 * @apiGroup History
 *
 * @apiSuccess {Number} service_id service id of the Service.
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
	//TODO validate body
	const dto: AddHistoryDto = {
		service_id: body.service_id,
		price: body.price,
		content: body.content,
		history_date: body.history_date,
		category_id: body.category_id,
		payment_id: body.payment_id,
	};

	try {
		const history = await History.create(dto);
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
	// params: { serviceId: '1', year: '2020', month: '8' }

	const params = req.params;
	const findArgs = {
		serviceId: parseInt(params.serviceId),
		year: parseInt(params.year),
		month: parseInt(params.month),
	};
	try {
		const history = await History.findByMonth(findArgs);
		if (history.length) {
			res
				.status(HttpStatus.OK)
				.json(
					JsonResponse(`got histories by month ${req.params.year}-${req.params.month}`, history)
				);
		} else {
			res
				.status(HttpStatus.BAD_REQUEST)
				.json(JsonResponse(`no histories by month ${req.params.year}-${req.params.month}`, null));
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

const bulkInsert = async (req: Request, res: Response, next: NextFunction) => {
	const { data } = req.body;
	try {
		const histories = await History.bulkInsert(data);
		res
			.status(HttpStatus.CREATED)
			.json(JsonResponse(`histories bulk insert success: ${histories}`, {}));
	} catch (err) {
		next(err);
	}
};

export default { create, findByMonth, update, remove, bulkInsert };
