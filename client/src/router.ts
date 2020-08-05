import ActionManager, { Observable } from './utils/action-manager';
import { MonthSelectorState } from './components/month-selector';
import { popstateType } from './index';
import { HistoryDataType } from './components/content/history-content/editor';

interface CurrentData {
	serviceId: number;
	yearAndMonth: string;
	viewName: string;
}

export interface YearAndMonth {
	year: number;
	month: number;
}

class Router extends Observable {
	private root: string;
	private current: CurrentData;

	constructor() {
		super();
		this.root = '/';
		const now = new Date();
		this.current = {
			serviceId: 1,
			yearAndMonth: `${now.getFullYear()}-${now.getMonth() + 1}`,
			viewName: 'history',
		};

		this.initEventManager();
	}

	public init() {
		const routeArr = location.pathname.replace(this.root, '').split('/');
		if (routeArr.length !== 3) {
			this.notify({ key: 'loadView', data: { viewName: 'not-found' } });
			return;
		}

		const serviceId = parseInt(routeArr[0], 16) - 3000;
		const yearAndMonth = routeArr[1].split('-');
		const year = parseInt(yearAndMonth[0]);
		const month = parseInt(yearAndMonth[1]);
		const viewName = routeArr[2];

		this.setYearAndMonth(year, month);
		this.setViewName(viewName);
		this.notify({ key: 'loadHistory', data: { serviceId, year, month } });
		this.notify({ key: 'loadView', data: { viewName } });

		this.updateCurrentUrl();
	}

	private initEventManager() {
		ActionManager.subscribe({
			key: 'changeDate',
			observer: (data: MonthSelectorState) => {
				if (this.current.yearAndMonth === `${data.year}-${data.month}`) {
					console.info('already load year and month', this.current.yearAndMonth);
					return;
				}
				this.setYearAndMonth(data.year, data.month);
				this.updateCurrentUrl();
				this.notify({ key: 'loadHistory', data: { ...data, serviceId: this.current.serviceId } });
			},
		});

		ActionManager.subscribe({
			key: 'changeTab',
			observer: (data) => {
				if (this.current.viewName === data.viewName) {
					console.info('already load view', this.current.viewName);
					return;
				}
				this.setViewName(data.viewName);
				this.updateCurrentUrl();
				this.notify({ key: 'loadView', data: { viewName: data.viewName } });
			},
		});

		ActionManager.subscribe({
			key: 'popstate',
			observer: (data: popstateType) => {
				this.setYearAndMonth(data.year, data.month);
				this.setViewName(data.viewName);
				this.notify({
					key: 'loadHistory',
					data: {
						serviceId: this.current.serviceId,
						year: data.year,
						month: data.month,
					},
				});
				this.notify({ key: 'loadView', data: { viewName: data.viewName } });
			},
		});

		ActionManager.subscribe({
			key: 'addHistory',
			observer: (data: HistoryDataType) => {
				this.notify({ key: 'addHistory', data: data });
			},
		});

		ActionManager.subscribe({
			key: 'editHistory',
			observer: (data: HistoryDataType) => {
				this.notify({ key: 'editHistory', data: data });
			},
		});

		ActionManager.subscribe({
			key: 'removeHistory',
			observer: (data: { history_id: number; historyDate: string }) => {
				this.notify({ key: 'removeHistory', data: data });
			},
		});
	}

	public updateCurrentUrl() {
		history.pushState(
			null,
			'',
			`${this.root}${(this.current.serviceId + 3000).toString(16)}/${this.current.yearAndMonth}/${
				this.current.viewName
			}`
		);
	}

	private setYearAndMonth(year: number, month: number) {
		this.current.yearAndMonth = `${year}-${month}`;
	}

	private setViewName(viewName: string) {
		this.current.viewName = viewName;
	}
}

export default new Router();

/**
 * key : loadHistory
 * [subscribe]
 * HistoryModel.load(serviceId, year, month)
 *
 * [notify]
 * Router.ActionManager.subscribe('popstate')
 * Router.ActionManager.subscribe('changeDate')
 * Router.init
 */

/**
 * key : loadView
 * [subscribe]
 * MainPenal.changeView(viewName)
 *
 * [notify]
 * Router.ActionManager.subscribe('popstate')
 * Router.ActionManager.subscribe('changeTab')
 * Router.init
 */

/**
 * key : addHistory
 * [subscribe]
 * HistoryModel.add(data)
 *
 * [notify]
 * Router.ActionManager.subscribe('addHistory')
 */

/**
 * key : editHistory
 * [subscribe]
 * HistoryModel.edit(data)
 *
 * [notify]
 * Router.ActionManager.subscribe('editHistory')
 */

/**
 * key : removeHistory
 * [subscribe]
 * HistoryModel.remove(data)
 *
 * [notify]
 * Router.ActionManager.subscribe('removeHistory')
 */
