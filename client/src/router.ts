import ActionManager, {
	Observable,
	CHANGE_DATE_ACTION,
	CHANGE_TAB_ACTION,
	POP_STATE_ACTION,
	ADD_HISTORY_ACTION,
	EDIT_HISTORY_ACTION,
	REMOVE_HISTORY_ACTION,
	LOGIN_ACTION,
} from './utils/action-manager';
import { MonthSelectorState } from './components/month-selector';
import { popstateType } from './index';
import { HistoryDataType } from './components/content/history-content/editor';
import { UserApi } from './api';
import HttpStatus from 'http-status';

interface CurrentData {
	serviceId: number;
	year: number;
	month: number;
	viewName: string;
	pageName: string;
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
			year: now.getFullYear(),
			month: now.getMonth() + 1,
			viewName: 'history',
			pageName: 'service',
		};

		this.initEventManager();
	}

	public async init() {
		const token = localStorage.getItem('token');
		console.log('token', token);
		if (!token) {
			this.notify({ key: 'loadPage', data: { pageName: 'login' } });
			return;
		}

		const response = await UserApi.isValidToken({ token });
		if (response.status === HttpStatus.UNAUTHORIZED) {
			this.notify({ key: 'loadPage', data: { pageName: 'login' } });
			return;
		}

		try {
			const route = location.pathname.replace(this.root, '');
			const routeArr = route.split('/');
			const serviceId = parseInt(routeArr[0], 16) - 3000;
			const yearAndMonth = routeArr[1].split('-');
			const year = parseInt(yearAndMonth[0]);
			const month = parseInt(yearAndMonth[1]);
			const viewName = routeArr[2];
			const pageName = 'service';

			this.setYearAndMonth(year, month);
			this.setViewName(viewName);
			this.setPageName(pageName);
			this.notify({ key: 'loadHistory', data: { serviceId, year, month } });
			this.notify({ key: 'loadView', data: { viewName } });
			this.notify({ key: 'loadPage', data: { pageName } });
		} catch (err) {
			this.notify({
				key: 'loadHistory',
				data: {
					serviceId: this.current.serviceId,
					year: this.current.year,
					month: this.current.month,
				},
			});
			this.notify({ key: 'loadView', data: { viewName: 'history' } });
			this.notify({ key: 'loadPage', data: { pageName: 'service' } });
		}
	}

	private initEventManager() {
		ActionManager.subscribe({
			key: CHANGE_DATE_ACTION,
			observer: (data: MonthSelectorState) => {
				if (this.current.year === data.year && this.current.month === data.month) {
					console.info('already load year and month', `${this.current.year}-${this.current.month}`);
					return;
				}
				this.setYearAndMonth(data.year, data.month);
				this.updateCurrentUrl();
				this.notify({ key: 'loadHistory', data: { ...data, serviceId: this.current.serviceId } });
			},
		});

		ActionManager.subscribe({
			key: CHANGE_TAB_ACTION,
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
			key: POP_STATE_ACTION,
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
			key: ADD_HISTORY_ACTION,
			observer: (data: HistoryDataType) => {
				this.notify({ key: 'addHistory', data: data });
			},
		});

		ActionManager.subscribe({
			key: EDIT_HISTORY_ACTION,
			observer: (data: HistoryDataType) => {
				this.notify({ key: 'editHistory', data: data });
			},
		});

		ActionManager.subscribe({
			key: REMOVE_HISTORY_ACTION,
			observer: (data: { history_id: number; historyDate: string }) => {
				this.notify({ key: 'removeHistory', data: data });
			},
		});

		ActionManager.subscribe({
			key: LOGIN_ACTION,
			observer: (data: { serviceId: number }) => {
				this.setServiceId(data.serviceId);
				this.notify({
					key: 'loadHistory',
					data: {
						serviceId: this.current.serviceId,
						year: this.current.year,
						month: this.current.month,
					},
				});
				this.notify({ key: 'loadView', data: { viewName: this.current.viewName } });
				this.notify({ key: 'loadPage', data: { pageName: 'service' } });
				this.updateCurrentUrl();
			},
		});

		this.subscribe({
			key: 'loadPage',
			observer: (data) => {
				this.setPageName(data.pageName);
				if (this.current.pageName === 'service') {
					this.updateCurrentUrl();
				} else {
					history.pushState(null, '', `${this.root}${data.pageName}`);
				}
			},
		});
	}

	public updateCurrentUrl() {
		history.pushState(
			null,
			'',
			`${this.root}${(this.current.serviceId + 3000).toString(16)}/${this.current.year}-${
				this.current.month
			}/${this.current.viewName}`
		);
	}

	private setServiceId(serviceId: number) {
		this.current.serviceId = serviceId;
	}

	private setYearAndMonth(year: number, month: number) {
		this.current.year = year;
		this.current.month = month;
	}

	private setViewName(viewName: string) {
		this.current.viewName = viewName;
	}

	private setPageName(pageName: string) {
		this.current.pageName = pageName;
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
 * key : loadPage
 * [subscribe]
 * index.changePage(pageName)
 *
 * [notify]
 * Router.ActionManager.subscribe('popstate')
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
