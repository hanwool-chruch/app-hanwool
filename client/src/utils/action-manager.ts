type Subscriber<T> = (data: T) => void;

class ActionManager {
	private observers: Map<String, Array<Subscriber<any>>>;

	constructor() {
		this.observers = new Map();
	}

	subscribe(key: string, observer: Subscriber<any>) {
		if (!this.observers.has(key)) {
			this.observers.set(key, new Array<Subscriber<any>>());
		}
		this.observers.get(key)!.push(observer);
	}

	notify(key: string, data: any) {
		if (this.observers.has(key)) {
			this.observers.get(key)!.forEach((subscriber) => subscriber(data));
		} else {
			throw new Error(`no subscriber in ${key}`);
		}
	}
}

export { ActionManager as Observable };
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
