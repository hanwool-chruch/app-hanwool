type Subscriber<T> = (data: T) => void;

export const POP_STATE_ACTION = 'popstate' as const;
export const ADD_HISTORY_ACTION = 'addHistory' as const;
export const EDIT_HISTORY_ACTION = 'editHistory' as const;
export const REMOVE_HISTORY_ACTION = 'removeHistory' as const;
export const CHANGE_DATE_ACTION = 'changeDate' as const;
export const CHANGE_TAB_ACTION = 'changeTab' as const;

type ACTION_KEYS =
	| typeof POP_STATE_ACTION
	| typeof ADD_HISTORY_ACTION
	| typeof EDIT_HISTORY_ACTION
	| typeof REMOVE_HISTORY_ACTION
	| typeof CHANGE_DATE_ACTION
	| typeof CHANGE_TAB_ACTION;

// TODO: find a way to integrate Action/Subscriber types

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
type AddHistoryData = {
	user_id: number;
	service_id: number;
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
type EditHistoryData = {
	user_id: number;
	service_id: number;
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

// | typeof REMOVE_HISTORY_ACTION
type RemoveHistoryData = {
	history_id: number;
	historyDate: string;
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

type NotifyType =
	| PopStateAction
	| AddHistoryAction
	| EditHistoryAction
	| RemoveHistoryAction
	| ChangeDateAction
	| ChangeTabAction;

type SubscriberType =
	| PopStateSubscriber
	| AddHistorySubscriber
	| EditHistorySubscriber
	| RemoveHistorySubscriber
	| ChangeDateSubscriber
	| ChangeTabSubscriber;

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
