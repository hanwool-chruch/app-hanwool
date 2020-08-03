import Router, { View } from '../../router';
import HistoryContent from '../content/history-content';
import Component from '../component';
import { AbstractContent } from '../content/abstract-content';
import MonthSelector from '../month-selector';
import TabSelector from '../tab-selector';

class MainPanel extends Component {
	dom: HTMLElement;
	monthSelector: any | null;
	tabSelector: any | null;
	contents: Map<String, AbstractContent>;
	router: any;

	constructor() {
		super();
		this.dom = document.createElement('main');
		this.contents = new Map<String, AbstractContent>();
		this.dom.classList.add('main-panel');
		this.monthSelector = null;
		this.tabSelector = null;
		this.router = null;
		this.init();
		this.listener();
	}

	init() {
		const views = this.initViews();
		this.router = new Router(views);

		let curMonth = parseInt(this.router.getCurrentYearAndMonth().split('-')[1]);
		this.monthSelector = new MonthSelector(curMonth, (diff: number) => {
			curMonth += diff;
			this.router.loadHistoryData(`2020-${curMonth}`);
			this.router.updateCurrentUrl();
			return curMonth;
		});

		this.tabSelector = new TabSelector((tab) => {
			console.log(tab);

			let page = '';
			switch (tab) {
				case '내역':
					page = 'history';
					break;
				case '달력':
					page = 'calendar';
					break;
				case '통계':
					page = 'graph';
					break;
				default:
					throw new Error('no tab exists');
			}
			this.router.loadView(page);
			this.router.updateCurrentUrl();
			alert(`Move to ${tab} tab`);
		});

		this.getDom().appendChild(this.monthSelector.getDom());
		this.getDom().appendChild(this.tabSelector.getDom());
	}

	private initViews(): Array<View> {
		const views = [] as Array<View>;
		const histroyView = { viewName: 'history', component: new HistoryContent() };
		const calendarView = { viewName: 'calendar', component: new HistoryContent() };
		const graphView = { viewName: 'graph', component: new HistoryContent() };

		views.push(histroyView);
		views.push(calendarView);
		views.push(graphView);

		return views;
	}

	private listener() {
		window.addEventListener('popstate', this.popStateHandler.bind(this));
	}

	/**
	 * TODO
	 * router 내로 옮기고 tabSelector와 monthSelector가 router를 구독하게?
	 */
	private async popStateHandler() {
		const routeArr = location.pathname.replace('/', '').split('/');
		const serviceId = parseInt(routeArr[0], 16) - 3000;
		const yearAndMonth = routeArr[1];
		const page = routeArr[2];
		this.router.setCurrent({ serviceId, yearAndMonth, page });
		console.info('popstate', { serviceId, yearAndMonth, page });

		let tabName;
		switch (page) {
			case 'history':
				tabName = '내역';
				break;
			case 'calendar':
				tabName = '달력';
				break;
			case 'graph':
				tabName = '통계';
				break;
			default:
				throw new Error('no pageName for tab');
		}

		this.monthSelector?.setMonth(yearAndMonth.split('-')[1]);
		this.tabSelector.setHighlight(tabName);
		this.router.loadView(page);
	}
}

export default MainPanel;
