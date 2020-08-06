import actionManager, {
	Observable,
	AddHistoryData,
	ADD_HISTORY_ACTION,
	EDIT_HISTORY_ACTION,
	REMOVE_HISTORY_ACTION,
} from '../utils/action-manager';
import { History, AddHistoryDto } from '@shared/dto/history-dto';
import { insertAt } from '../utils/insert-item-at';
import { YearAndMonth } from '../router';
import Router from '../router';
import historyApi from '../api/history-api';

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

		// TODO: remove any
		actionManager.subscribe({
			key: EDIT_HISTORY_ACTION,
			observer: (data: any) => {
				this.edit(data);
			},
		});

		actionManager.subscribe({
			key: REMOVE_HISTORY_ACTION,
			observer: (data: any) => {
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
			data = await historyApi.findByMonth({
				servideId: this.serviceId,
				year: this.year,
				month: this.month,
			});
		} catch (err) {
			data = [];
			console.error(err);
		}
		const key = createKey(this.serviceId, this.year, this.month);
		this.data.set(key, data);
		this.notify({ key: 'sendToViews', data: data });
	}

	async add(h: AddHistoryData): Promise<void> {
		let resultHistory: History;
		const data: AddHistoryDto = {
			service_id: this.serviceId,
			price: h.price,
			content: h.content,
			history_date: h.historyDate,
			category_id: h.category,
			payment_id: h.payment,
		};
		try {
			resultHistory = await historyApi.create(data);
		} catch (err) {
			throw new Error(`add data error`);
		}

		resultHistory.historyDate = new Date(resultHistory.historyDate);
		const key = `${resultHistory.historyDate.getFullYear()}-${
			resultHistory.historyDate.getMonth() + 1
		}`;
		const oldData = this.data.get(key) || [];
		const newData = insertHistory(oldData, resultHistory);
		this.data.set(key, newData);
		if (
			this.year === resultHistory.historyDate.getFullYear() &&
			this.month === resultHistory.historyDate.getMonth() + 1
		)
			this.notify({ key: 'sendToViews', data: newData });
	}

	async remove(h: History): Promise<void> {
		try {
			await apiMock(h);

			const key = createKey(
				this.serviceId,
				h.historyDate.getFullYear(),
				h.historyDate.getMonth() + 1
			);
			const data = this.data.get(key);
			if (!data) {
				//TODO: Error handling
				throw new Error(`No data :${h.historyDate}`);
			}

			const newData = data.filter((history) => history.id !== h.id);
			this.data.set(key, newData);
			this.notify({ key: 'sendToViews', data: newData });
		} catch (err) {
			throw new Error(`remove data error`);
		}
	}

	async edit(h: History): Promise<void> {
		try {
			const response: History = (await apiMock(h)) as any;

			const key = createKey(
				this.serviceId,
				h.historyDate.getFullYear(),
				h.historyDate.getMonth() + 1
			);
			const data = this.data.get(key);
			if (!data) {
				//TODO: Error handling
				throw new Error(`No data :${h.historyDate}`);
			}

			let newData = data.filter((history) => history.id !== h.id);
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

function createKey(serviceId: number, year: number, month: number): string {
	return [serviceId, year, month].join('-');
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
