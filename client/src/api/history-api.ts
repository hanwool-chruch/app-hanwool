import { POST, GET, PATCH, PUT, DELETE } from './utils';
import { AddHistoryDto, History } from '@shared/dto/history-dto';
import { ApiSuccessResponse } from '@shared/dto/api-response';
import { HistoryDto } from '@shared/dto';
import httpStatus from 'http-status';

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
			if (res.status === httpStatus.OK || res.status === httpStatus.NOT_MODIFIED) {
				return res.json();
			} else {
				throw new Error('unexpected error occured at history get api');
			}
		})
		.then((res: ApiSuccessResponse) => {
			return res.result.map((d: any) => {
				return { ...d, historyDate: new Date(d.historyDate) };
			}) as History[];
		}) as Promise<History[]>;

const update = (historyId: number, data: HistoryDto.EditHistoryDto): Promise<History> =>
	PUT(`/api/history/${historyId}`, data)
		.then((res: any) => {
			if (res.status === httpStatus.OK || res.status === httpStatus.NOT_MODIFIED) return res.json();
			else {
				throw new Error('unexpected error occured at history update api');
			}
		})
		.then((res: ApiSuccessResponse) => {
			return { ...res.result, historyDate: new Date(res.result.historyDate) };
		});

const softDelete = (data: { id: number }) => DELETE(`/api/history/${data.id}`);

export { create, findByMonth, update, softDelete };
