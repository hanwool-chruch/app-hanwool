import { POST, GET, PATCH, PUT, DELETE } from './utils';
import { AddHistoryDto, History } from '@shared/dto/history-dto';
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

type FindByMonth = {
	servideId: number;
	year: number;
	month: number;
};

const findByMonth = (data: FindByMonth): Promise<History[]> =>
	GET(`/api/history/${data.servideId}/${data.year}/${data.month}`)
		.then((res: any) => {
			if (res.ok) return res.json();
			else {
				//TODO: Error handling
				throw new Error('Error');
			}
		})
		.then((res: ApiSuccessResponse) => {
			return res.result.map((d: any) => {
				return { ...d, historyDate: new Date(d.historyDate) };
			}) as History[];
		}) as Promise<History[]>;

const update = (data: JSON) => PUT('/api/history', data);
const softDelete = (data: { id: number }) => DELETE(`/api/history/${data.id}`);

export default { create, findByMonth, update, softDelete };
