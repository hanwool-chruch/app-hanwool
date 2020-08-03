import { POST, GET, PATCH, PUT } from './utils';
import { AddHistoryDto } from '@shared/dto/history-dto';
import { ApiSuccessResponse } from '@shared/dto/api-response';

const create = (data: AddHistoryDto): Promise<History> =>
	POST('/api/history', data)
		.then((res: any) => {
			if (res.ok) return res.json();
			else {
				//TODO: Error handling
				throw new Error('Error');
			}
		})
		.then((res: ApiSuccessResponse) => {
			return res.result as History;
		}) as Promise<History>;

const findAll = (data: JSON) => GET('/api/history', data);
const update = (data: JSON) => PUT('/api/history', data);
const softDelete = (data: JSON) => PATCH(`/api/history/remove`, data);

export default { create, findAll, update, softDelete };
