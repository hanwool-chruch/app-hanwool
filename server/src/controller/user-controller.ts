import { Request, Response, NextFunction } from 'express';

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
const getUserById = async (req: Request, res: Response, next: NextFunction) => {};

export { getUserById };
