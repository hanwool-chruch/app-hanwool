import { Observable } from '../utils/action-manager';
import { History, AddHistoryDto } from '@shared/dto/history-dto';
import { load } from '../api/apiMocks';
import { insertAt } from '../utils/insert-item-at';
import { YearAndMonth } from '../router';
import Router from '../router';
import { HistoryDataType } from '../components/content/history-content/editor';

interface EditHistoryType {
	history_id: number;
	user_id: number;
	service_id: number;
	historyDate: string;
	category: number;
	payment: number;
	price: number;
	content: string;
}

const apiMock = (data: any) =>
	new Promise((resolve) => resolve({ ...data, id: ~~(Math.random() * 1000) }));

class HistoryModel extends Observable {
	private data: Map<string, History[]>;
	private serviceId: number;
	private year: number;
	private month: number;

	constructor() {
		super();
		this.data = new Map<string, History[]>();
		this.serviceId = 0;
		this.year = 0;
		this.month = 0;
		this.initEventManager();
	}

	private initEventManager() {
		Router.subscribe('loadHistory', (data) => {
			if (this.year === data.year && this.month === data.month) {
				console.info('already load year and month', `${data.year}-${data.month}`);
				return;
			}
			this.setYearAndMonth({ year: data.year, month: data.month });
			this.load();
		});

		Router.subscribe('addHistory', (data: HistoryDataType) => {
			this.add(data);
		});

		Router.subscribe('editHistory', (data: EditHistoryType) => {
			this.edit(data);
		});

		Router.subscribe('removeHistory', (data: { history_id: number; historyDate: string }) => {
			this.remove(data);
		});
	}

	public init(serviceId: number) {
		this.serviceId = serviceId;
	}

	private async load(): Promise<void> {
		// TODO: api call
		try {
			const data = await load(this.serviceId);
			const key = `${this.year}-${this.month}`;
			this.data.set(key, data);
			this.notify('sendToViews', data);
		} catch (err) {
			throw new Error(`load data error`);
		}
	}

	async add(h: HistoryDataType): Promise<void> {
		try {
			const response: History = (await apiMock(h)) as any;
			const dateArr = h.historyDate.split('. ');
			const key = `${dateArr[0]}-${dateArr[1]}`;
			const data = this.data.get(key);
			if (!data) {
				//TODO: Error handling
				throw new Error(`No data :${h.historyDate}`);
			}
			const newData = insertHistory(data, response);
			this.data.set(key, newData);
			this.notify('sendToViews', newData);
		} catch (err) {
			throw new Error(`add data error`);
		}
	}

	async remove(h: { history_id: number; historyDate: string }): Promise<void> {
		try {
			await apiMock(h);

			const dateArr = h.historyDate.split(' .');
			const key = `${dateArr[0]}-${dateArr[1]}`;
			const data = this.data.get(key);
			if (!data) {
				//TODO: Error handling
				throw new Error(`No data :${h.historyDate}`);
			}

			const newData = data.filter((history) => history.id !== h.history_id);
			this.data.set(key, newData);
			this.notify('sendToViews', newData);
		} catch (err) {
			throw new Error(`remove data error`);
		}
	}

	async edit(h: EditHistoryType): Promise<void> {
		try {
			const response: History = (await apiMock(h)) as any;

			const dateArr = h.historyDate.split(' .');
			const key = `${dateArr[0]}-${dateArr[1]}`;
			const data = this.data.get(key);
			if (!data) {
				//TODO: Error handling
				throw new Error(`No data :${h.historyDate}`);
			}

			let newData = data.filter((history) => history.id !== h.history_id);
			newData = insertHistory(newData, response);
			this.data.set(key, newData);
			this.notify('sendToViews', newData);
		} catch (err) {
			throw new Error(`edit data error`);
		}
	}

	setYearAndMonth(yearAndMonth: YearAndMonth) {
		this.year = yearAndMonth.year;
		this.month = yearAndMonth.month;
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

export default new HistoryModel();

/**
 * key : sendToViews
 * [subscribe]
 * MainPenal.contents.forEach.load(data)
 *
 * [notify]
 * HistoryModel.load
 * HistoryModel.add
 * HistoryModel.remove
 * HistoryModel.edit
 */
