import Component from '../component';
import { AbstractContent } from '../content/abstract-content';
import MonthSelector from '../month-selector';
import TabSelector from '../tab-selector';
import TabName from '../../utils/tab-name';
import HistoryContent from '../content/history-content';
import CalendarContent from '../content/calendar-content';
import Router from '../../router';
import HistoryManager from '../../models/history-model';
import StatisticsContent from '../content/statistics-content';

export default class MainPanel extends Component {
	protected dom: HTMLElement;
	private contents: Map<string, AbstractContent>;

	constructor() {
		super();
		this.dom = document.createElement('main');
		this.contents = new Map<string, AbstractContent>();
		this.init();
		this.initEventManager();
	}

	init() {
		this.dom.classList.add('main-panel');

		const routeArr = location.pathname.replace('/', '').split('/');
		const locationDate = routeArr[1].split('-');
		const monthState = { year: parseInt(locationDate[0]), month: parseInt(locationDate[1]) };
		const monthSelector = new MonthSelector(monthState);

		const tabs = ['내역', '달력', '통계'];
		const currentTab = TabName[routeArr[2]];
		const tabState = {
			tabs: tabs,
			currentTab: currentTab,
		};
		const tabSelector = new TabSelector(tabState);

		this.dom.appendChild(monthSelector.getDom());
		this.dom.appendChild(tabSelector.getDom());

		this.initViews();
	}

	initViews() {
		const historyContent = new HistoryContent();
		const calendarContent = new CalendarContent();
		const statisticsContent = new StatisticsContent();
		this.contents.set('history', historyContent);
		this.contents.set('calendar', calendarContent);
		this.contents.set('statistics', statisticsContent);
	}

	private initEventManager() {
		Router.subscribe({ key: 'loadView', observer: (data) => this.changeView(data.viewName) });
		HistoryManager.subscribe({
			key: 'sendToViews',
			observer: (data) => {
				this.contents.forEach((content) => content.load(data));
			},
		});
	}

	changeView(view: string) {
		if (this.contents.has(view)) {
			const newView = this.contents.get(view);
			while (this.dom.childElementCount !== 2) {
				this.dom.lastElementChild?.remove();
			}
			this.dom.appendChild(newView!.getDom());
		}
	}
}
