import actionManager, {
	Observable,
	AddHistoryData,
	EditHistoryData,
	ADD_HISTORY_ACTION,
	EDIT_HISTORY_ACTION,
	REMOVE_HISTORY_ACTION,
} from '../utils/action-manager';
import { History, AddHistoryDto } from '@shared/dto/history-dto';
import { insertAt } from '../utils/insert-item-at';
import { YearAndMonth } from '../router';
import Router from '../router';
import api from '../api/history-api';

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
		Router.subscribe({
			key: 'loadHistory',
			observer: (data) => {
				if (
					this.year === data.year &&
					this.month === data.month &&
					this.serviceId === data.serviceId
				) {
					console.info(
						'already load year and month',
						`${data.serviceId}/${data.year}-${data.month}`
					);
					return;
				}
				this.setServiceId(data.serviceId);
				this.setYearAndMonth({ year: data.year, month: data.month });
				this.load();
			},
		});

		actionManager.subscribe({
			key: ADD_HISTORY_ACTION,
			observer: (data) => {
				this.add(data);
			},
		});

		actionManager.subscribe({
			key: EDIT_HISTORY_ACTION,
			observer: (data) => {
				this.edit(data);
			},
		});

		actionManager.subscribe({
			key: REMOVE_HISTORY_ACTION,
			observer: (data) => {
				this.remove(data);
			},
		});
	}

	public init(serviceId: number) {
		this.serviceId = serviceId;
	}

	private async load(): Promise<void> {
		let data: History[];
		try {
			data = await api.findByMonth({
				servideId: 1,
				year: this.year,
				month: this.month,
			});
			console.log(data);
		} catch (err) {
			data = [];
			console.error(err);
		}
		const key = `${this.serviceId}/${this.year}-${this.month}`;
		this.data.set(key, data);
		this.notify({ key: 'sendToViews', data: data });
	}

	async add(h: AddHistoryData): Promise<void> {
		let response: History;
		try {
			response = (await apiMock(h)) as any;
		} catch (err) {
			throw new Error(`add data error`);
		}

		response.historyDate = new Date(response.historyDate);
		const key = `${response.historyDate.getFullYear()}-${response.historyDate.getMonth() + 1}`;
		const data = this.data.get(key) || [];
		const newData = insertHistory(data, response);
		this.data.set(key, newData);
		this.notify({ key: 'sendToViews', data: newData });
		console.log('newasdfasf', newData);
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
			this.notify({ key: 'sendToViews', data: newData });
		} catch (err) {
			throw new Error(`remove data error`);
		}
	}

	async edit(h: EditHistoryData): Promise<void> {
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
			this.notify({ key: 'sendToViews', data: newData });
		} catch (err) {
			throw new Error(`edit data error`);
		}
	}

	setYearAndMonth(yearAndMonth: YearAndMonth) {
		this.year = yearAndMonth.year;
		this.month = yearAndMonth.month;
	}

	setServiceId(serviceId: number) {
		this.serviceId = serviceId;
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
