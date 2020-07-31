import Observable from './observable';
import { History, AddHistoryDto } from '@shared/dto/history-dto';
import { load } from '../api/apiMocks';

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
		this.load();
		this.serviceId = servideId;
	}

	private async load(): Promise<void> {
		// TODO: api call
		const data = await load(this.serviceId);
		this.data = data;
		this.notify(this.data);
	}

	async add(h: AddHistoryDto): Promise<void> {
		const response: History = (await apiMock(h)) as any;
		let added = false;
		for (let i = 0; i < this.data.length - 1; ++i) {
			if (this.data[i + 1].historyDate > h.historyDate) {
				this.data = [...this.data.slice(0, i), response, ...this.data.slice(i)];
				added = true;
				break;
			}
		}
		if (!added) this.data.push(response);

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
		for (let i = 0; i < this.data.length; ++i) {
			if (i === this.data.length) this.data.push(h);
			else if (this.data[i].historyDate < h.historyDate) {
				this.data = [...this.data.slice(0, i), h, ...this.data.slice(i)];
			}
		}
		this.notify(this.data);
	}
}
