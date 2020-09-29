import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status';
import { Category } from '../model';
import { JsonResponse } from '../modules/util';

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
		const category = await Category.create(body as any);
		res
			.status(HttpStatus.CREATED)
			.json(JsonResponse(`category created(${category.category_name})`, category));
	} catch (err) {
		next(err);
	}
};

const findByServiceId = async (req: Request, res: Response, next: NextFunction) => {
	const serviceId = parseInt(req.params.id);
	if (isNaN(serviceId)) next(new Error('Improper servide id'));

	try {
		const categories = await Category.findByServiceId(serviceId);
		res
			.status(HttpStatus.OK)
			.json(JsonResponse(`Got categories by service ${serviceId}`, categories));
	} catch (err) {
		next(err);
	}
};

const bulkInsert = async (req: Request, res: Response, next: NextFunction) => {
	const { data } = req.body;
	try {
		const { insertId, affectedRows } = await Category.bulkInsert(data);
		res
			.status(HttpStatus.CREATED)
			.json(
				JsonResponse(`category bulk insert success: ${affectedRows}`, { insertId, affectedRows })
			);
	} catch (err) {
		next(err);
	}
};

export default { create, findByServiceId, bulkInsert };
