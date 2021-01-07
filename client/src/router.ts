import ActionManager, {
	Observable,
	CHANGE_DATE_ACTION,
	CHANGE_TAB_ACTION,
	POP_STATE_ACTION,
	LOGIN_ACTION,
	MAIN_ACTION
} from './utils/action-manager';
import { MonthSelectorState } from './components/month-selector';
import { popstateType } from './index';
import { UserApi } from './api';
import HttpStatus from 'http-status';
import { getCookie } from './utils/cookie-manager';

interface CurrentData {
	serviceId: number;
	year: number;
	month: number;
	viewName: string;
	pageName: string;
}

interface UserData {
	userId: number;
}

export interface YearAndMonth {
	year: number;
	month: number;
}

class Router extends Observable {
	private root: string;
	private current: CurrentData;
	private user: UserData;

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
		this.user = { userId: 0}

		this.initEventManager();
	}

	public async init() {
		const token = getCookie('authorization');
		if (!token) {
			this.notify({ key: 'loadPage', data: { pageName: 'login' } });
			return;
		}

		try {
			const response = await UserApi.isValidToken({ token });
			if (response.status !== HttpStatus.OK && response.status !== HttpStatus.NOT_MODIFIED) {
				this.notify({ key: 'loadPage', data: { pageName: 'login' } });
				return;
			}

			const responseData = (await response.json()).result;

			const serviceId = responseData.serviceId;
			this.setServiceId(serviceId);
			this.setUserId(responseData.userId)

			//(temp) send serviceId to Header for bulk insert
			this.notify({ key: 'publishServiceId', data: { serviceId } });

			const route = location.pathname.replace(this.root, '');
			const routeArr = route.split('/');
			const yearAndMonth = routeArr[1].split('-');
			const year = parseInt(yearAndMonth[0]);
			const month = parseInt(yearAndMonth[1]);
			const viewName = routeArr[2];

			this.setYearAndMonth(year, month);
			this.setViewName(viewName);
			this.notify({ key: 'loadHistory', data: { serviceId, year, month } });
			this.notify({ key: 'loadView', data: { viewName, serviceId } });
			this.notify({ key: 'loadPage', data: { pageName: this.current.pageName } });
		} catch (err) {
			this.notify({
				key: 'loadHistory',
				data: {
					serviceId: this.current.serviceId,
					year: this.current.year,
					month: this.current.month,
				},
			});
			this.notify({
				key: 'loadView',
				data: { viewName: 'history', serviceId: this.current.serviceId },
			});
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
				this.notify({
					key: 'loadView',
					data: { viewName: data.viewName, serviceId: this.current.serviceId },
				});
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
				this.notify({
					key: 'loadView',
					data: { viewName: data.viewName, serviceId: this.current.serviceId },
				});
			},
		});

		ActionManager.subscribe({
			key: LOGIN_ACTION,
			observer: (data) => {
				this.setServiceId(data.serviceId);
				this.notify({
					key: 'loadHistory',
					data: {
						serviceId: this.current.serviceId,
						year: this.current.year,
						month: this.current.month,
					},
				});
				this.notify({
					key: 'loadView-qr',
					data: { viewName: this.current.viewName, userId: data.userId },
				});
				this.notify({ key: 'loadPage', data: { pageName: 'main' } });
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

	private setUserId(userId: number) {
		this.user.userId = userId;
	}

	public getUserId() {
		return this.user.userId;
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
