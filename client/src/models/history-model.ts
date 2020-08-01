import Observable from './observable';
import { History, AddHistoryDto } from '@shared/dto/history-dto';
import { load } from '../api/apiMocks';
import { insertAt } from '../utils/insert-item-at';

const apiMock = (data: any) =>
	new Promise((resolve) => resolve({ ...data, id: ~~(Math.random() * 1000) }));

export default class HistoryModel extends Observable<History[]> {
	private data: History[];
	private serviceId: number;

	/**
	 *
	 * @param servideId {number} - set service id
	 */
	constructor(servideId: number) {
		super();
		this.data = [];
		this.serviceId = servideId;
		setTimeout(() => {
			this.load();
		}, 0);
	}

	private async load(): Promise<void> {
		// TODO: api call
		const data = await load(this.serviceId);
		this.data = data;
		this.notify(this.data);
	}

	async add(h: AddHistoryDto): Promise<void> {
		const response: History = (await apiMock(h)) as any;
		this.data = insertHistory(this.data, response);
		this.notify(this.data);
	}

	async remove(h: History): Promise<void> {
		await apiMock(h);

		this.data = this.data.filter((history) => history.id !== h.id);
		this.notify(this.data);
	}

	async edit(h: History): Promise<void> {
		await apiMock(h);
		this.data = this.data.filter((history) => history.id !== h.id);
		insertHistory(this.data, h);
		this.notify(this.data);
	}
}

function insertHistory(list: History[], item: History) {
	for (let i = 0; i < list.length - 1; ++i) {
		if (list[i + 1].historyDate > item.historyDate) {
			return insertAt(list, item, i);
		}
	}
	return [...list, item];
}
