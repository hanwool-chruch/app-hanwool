import { History } from '@shared/dto/history-dto';

type Subscriber<T> = (data: T) => void;

export const POP_STATE_ACTION = 'popstate' as const;
export const ADD_HISTORY_ACTION = 'addHistory' as const;
export const EDIT_HISTORY_ACTION = 'editHistory' as const;
export const START_EDIT_HISTORY_ACTION = 'startEditHistory' as const;
export const REMOVE_HISTORY_ACTION = 'removeHistory' as const;
export const CHANGE_DATE_ACTION = 'changeDate' as const;
export const CHANGE_TAB_ACTION = 'changeTab' as const;
export const LOGIN_ACTION = 'login' as const;
export const DISABLE_BULK_CATEGORY = 'disableBulkCategory' as const;
export const DISABLE_BULK_PAYMENT = 'disableBulkPayment' as const;
export const RELOAD_HISTORY_ACTION = 'reloadHistory' as const;

type ACTION_KEYS =
	| typeof POP_STATE_ACTION
	| typeof ADD_HISTORY_ACTION
	| typeof START_EDIT_HISTORY_ACTION
	| typeof EDIT_HISTORY_ACTION
	| typeof REMOVE_HISTORY_ACTION
	| typeof CHANGE_DATE_ACTION
	| typeof CHANGE_TAB_ACTION
	| typeof LOGIN_ACTION
	| typeof DISABLE_BULK_CATEGORY
	| typeof DISABLE_BULK_PAYMENT
	| typeof RELOAD_HISTORY_ACTION;

// TODO: find a way to integrate Action/Subscriber types

//login
type LoginData = {
	serviceId: number;
};

type LoginAction = {
	key: typeof LOGIN_ACTION;
	data: LoginData;
};

type LoginSubscriber = {
	key: typeof LOGIN_ACTION;
	observer: Subscriber<LoginData>;
};

// PopState
type PopStateData = {
	serviceId: number;
	year: number;
	month: number;
	viewName: string;
};

type PopStateAction = {
	key: typeof POP_STATE_ACTION;
	data: PopStateData;
};

type PopStateSubscriber = {
	key: typeof POP_STATE_ACTION;
	observer: Subscriber<PopStateData>;
};

// AddHistory
export type AddHistoryData = {
	historyDate: string;
	category: number;
	payment: number;
	price: number;
	content: string;
};

type AddHistoryAction = {
	key: typeof ADD_HISTORY_ACTION;
	data: AddHistoryData;
};

type AddHistorySubscriber = {
	key: typeof ADD_HISTORY_ACTION;
	observer: Subscriber<AddHistoryData>;
};

// EDIT_HISTORY_ACTION
export type EditHistoryData = {
	id: number;
	historyDate: string;
	category: number;
	payment: number;
	price: number;
	content: string;
};

type EditHistoryAction = {
	key: typeof EDIT_HISTORY_ACTION;
	data: EditHistoryData;
};

type EditHistorySubscriber = {
	key: typeof EDIT_HISTORY_ACTION;
	observer: Subscriber<EditHistoryData>;
};

// START_EDIT_HISTORY_ACTION
export type StartEditHistoryData = {
	history: History;
};

type StartEditHistoryAction = {
	key: typeof START_EDIT_HISTORY_ACTION;
	data: StartEditHistoryData;
};

type StartEditHistorySubscriber = {
	key: typeof START_EDIT_HISTORY_ACTION;
	observer: Subscriber<StartEditHistoryData>;
};
// | typeof REMOVE_HISTORY_ACTION
export type RemoveHistoryData = {
	history: History;
};

type RemoveHistoryAction = {
	key: typeof REMOVE_HISTORY_ACTION;
	data: RemoveHistoryData;
};

type RemoveHistorySubscriber = {
	key: typeof REMOVE_HISTORY_ACTION;
	observer: Subscriber<RemoveHistoryData>;
};

// CHANGE_DATE_ACTION
type ChangeDateData = {
	year: number;
	month: number;
};

type ChangeDateAction = {
	key: typeof CHANGE_DATE_ACTION;
	data: ChangeDateData;
};

type ChangeDateSubscriber = {
	key: typeof CHANGE_DATE_ACTION;
	observer: Subscriber<ChangeDateData>;
};

// CHANGE_TAB_ACTION;
type ChangeTabData = {
	viewName: string;
};

type ChangeTabAction = {
	key: typeof CHANGE_TAB_ACTION;
	data: ChangeTabData;
};

type ChangeTabSubscriber = {
	key: typeof CHANGE_TAB_ACTION;
	observer: Subscriber<ChangeTabData>;
};

// DISABLE_BULK_PAYMENT
type DisableBulkData = {};

type DisableBulkPaymentAction = {
	key: typeof DISABLE_BULK_PAYMENT;
	data: DisableBulkData;
};

type DisableBulkPaymentSubscriber = {
	key: typeof DISABLE_BULK_PAYMENT;
	observer: Subscriber<DisableBulkData>;
};

// DISABLE_BULK_CATEGORY
type DisableBulkCategoryAction = {
	key: typeof DISABLE_BULK_CATEGORY;
	data: DisableBulkData;
};

type DisableBulkCategorySubscriber = {
	key: typeof DISABLE_BULK_CATEGORY;
	observer: Subscriber<DisableBulkData>;
};

//RELOAD_HISTORY_ACTION
type ReloadHistoryAction = {
	key: typeof RELOAD_HISTORY_ACTION;
	data: DisableBulkData;
};

type ReloadHistorySubscriber = {
	key: typeof RELOAD_HISTORY_ACTION;
	observer: Subscriber<DisableBulkData>;
};

type NotifyType =
	| PopStateAction
	| AddHistoryAction
	| EditHistoryAction
	| StartEditHistoryAction
	| RemoveHistoryAction
	| ChangeDateAction
	| ChangeTabAction
	| LoginAction
	| DisableBulkPaymentAction
	| DisableBulkCategoryAction
	| ReloadHistoryAction;

type SubscriberType =
	| PopStateSubscriber
	| AddHistorySubscriber
	| EditHistorySubscriber
	| StartEditHistorySubscriber
	| RemoveHistorySubscriber
	| ChangeDateSubscriber
	| ChangeTabSubscriber
	| LoginSubscriber
	| DisableBulkCategorySubscriber
	| DisableBulkPaymentSubscriber
	| ReloadHistorySubscriber;

class Observable {
	private observers: Map<string, Array<Subscriber<any>>>;

	constructor() {
		this.observers = new Map();
	}

	subscribe({ key, observer }: { key: string; observer: Subscriber<any> }) {
		if (!this.observers.has(key)) {
			this.observers.set(key, new Array<Subscriber<any>>());
		}
		this.observers.get(key)!.push(observer);
	}

	notify({ key, data }: { key: string; data: any }) {
		if (this.observers.has(key)) {
			this.observers.get(key)!.forEach((subscriber) => subscriber(data));
		} else {
			throw new Error(`no subscriber in ${key}`);
		}
	}
}

class ActionManager {
	private observers: Map<ACTION_KEYS, Array<Subscriber<any>>>;

	constructor() {
		this.observers = new Map();
	}

	subscribe({ key, observer }: SubscriberType) {
		if (!this.observers.has(key)) {
			this.observers.set(key, new Array<Subscriber<any>>());
		}
		this.observers.get(key)!.push(observer);
	}

	notify({ key, data }: NotifyType) {
		if (this.observers.has(key)) {
			this.observers.get(key)!.forEach((subscriber) => subscriber(data));
		} else {
			throw new Error(`no subscriber in ${key}`);
		}
	}
}

export { Observable };
export default new ActionManager();

/**
 * key : popstate
 * [subscribe]
 * MonthSelector.setDate(year, month)
 * TabSelector.setHighlight(tabName)
 * Router.setYearAndMonth(data.year, data.month);
 * Router.setViewName(data.viewName);
 * Router.notify('loadHistory', data);
 * Router.notify('loadView', viewName);
 *
 * [notify]
 * App.window 'popstate' event handler (serviceId, year, month, viewName)
 */

/**
 * key : changeDate
 * [subscribe]
 * Router.setYearAndMonth(data.year, data.month);
 * Router.updateCurrentUrl();
 * Router.notify('loadHistory', data);
 *
 * [notify]
 * MonthSelector.prevBtn 'click' event handler (year, month)
 * MonthSelector.nextBtn 'click' event handler (year, month)
 */

/**
 * key : changeTab
 * [subscribe]
 * Router.setViewName(viewName);
 * Router.updateCurrentUrl();
 * Router.notify('loadView', viewName);
 *
 * [notify]
 * TabSelector.dom 'click' event handler (tabName)
 */

/**
 * key : addHistory
 * [subscribe]
 * Router.notify('addHistory', data);
 *
 * [notify]
 * Editor.confirmBtn 'click' event handler (history data)
 */

/**
 * key : editHistory
 * [subscribe]
 * Router.notify('editHistory', data);
 *
 * [notify]
 * Editor.confirmBtn 'click' event handler (history data)
 */

/**
 * key : removeHistory
 * [subscribe]
 * Router.notify('removeHistory', data);
 *
 * [notify]
 * HistoryList.btn 'click' event handler (history data)
 */
