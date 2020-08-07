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
import { HistoryApi } from '../api';
import httpStatus from 'http-status';

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
				this.remove(data.history);
			},
		});
	}

	private async load(): Promise<void> {
		let data: History[];
		try {
			data = await HistoryApi.findByMonth({
				servideId: this.serviceId,
				year: this.year,
				month: this.month,
			});
		} catch (err) {
			data = [];
			if (err) {
				if (err.status !== httpStatus.BAD_REQUEST) {
					console.error(err.stack);
				}
			}
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
			resultHistory = await HistoryApi.create(data);
		} catch (err) {
			throw new Error(`add data error`);
		}

		resultHistory.historyDate = new Date(resultHistory.historyDate);
		const key = createKey(
			this.serviceId,
			resultHistory.historyDate.getFullYear(),
			resultHistory.historyDate.getMonth() + 1
		);
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
			await HistoryApi.softDelete({ id: h.id });
		} catch (err) {
			throw new Error(`remove data error`);
		}
		console.log(h);
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

		const newData = data!.filter((history) => history.id !== h.id);
		this.data.set(key, newData);
		this.notify({ key: 'sendToViews', data: newData });
	}

	async edit(h: History): Promise<void> {
		let response: History;
		try {
			const editArgs = { ...h };
			delete editArgs.id;
			response = await HistoryApi.update(h.id, editArgs);
		} catch (err) {
			throw new Error(`edit data error`);
		}

		const date: Date = new Date(h.historyDate);
		const key1 = createKey(this.serviceId, date.getFullYear(), date.getMonth() + 1);
		let data1 = this.data.get(key1);
		if (!data1) {
			//TODO: Error handling
			throw new Error(`No data :${h.historyDate}`);
		}

		let newData1 = data1.filter((history) => history.id !== h.id);
		this.data.set(key1, newData1);

		newData1 = insertHistory(newData1, response);
		this.notify({ key: 'sendToViews', data: newData1 });

		const key = createKey(
			this.serviceId,
			response!.historyDate.getFullYear(),
			response!.historyDate.getMonth() + 1
		);

		let data = this.data.get(key);
		if (!data) {
			//TODO: Error handling
			throw new Error(`No data :${h.historyDate}`);
		}

		const newData = insertHistory(data, response!);
		this.data.set(key, newData);

		if (
			this.year === response!.historyDate.getFullYear() &&
			this.month === response!.historyDate.getMonth() + 1
		)
			this.notify({ key: 'sendToViews', data: newData });
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
