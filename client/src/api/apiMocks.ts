import { AddHistoryDto } from '@shared/dto/history-dto';
import { History } from '@shared/dto/history-dto';

export const create = (data: AddHistoryDto): Promise<History> => {
	return Promise.resolve({ ...data, id: ~~(Math.random() * 1000) });
};

export const load = (serviceId: number): Promise<History[]> => {
	return Promise.resolve([
		{
			category: '밥',
			historyDate: new Date('2020-08-01'),
			content: '순댓국',
			id: 1,
			payment: '외상',
			price: -4000,
		},
		{
			category: '주식',
			historyDate: new Date('2020-08-01'),
			content: '상장폐지',
			id: 2,
			payment: '주식',
			price: +5000,
		},
		{
			category: '밥',
			historyDate: new Date('2020-08-01'),
			content: '순댓국1',
			id: 3,
			payment: '외상',
			price: -3000,
		},
		{
			category: '일',
			historyDate: new Date('2020-08-03'),
			content: '부업',
			id: 4,
			payment: '현금',
			price: 6000,
		},
	]);
};
