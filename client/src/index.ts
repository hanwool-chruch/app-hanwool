import './styles/global.scss';

import Header from './components/header';
import MainPanel from './components/main-panel';
import HistoryModel from './models/history-model';
import Router from './router';
import ActionManager from './utils/action-manager';

export interface popstateType {
	serviceId: number;
	year: number;
	month: number;
	viewName: string;
}
class App {
	private container: HTMLElement;

	constructor() {
		this.container = document.getElementById('app') as HTMLElement;
		this.init();
		this.listener();
	}

	init() {
		const header = new Header();
		const mainPanel = new MainPanel();
		HistoryModel.init(1);
		Router.init();

		this.container.appendChild(header.getDom());
		this.container.appendChild(mainPanel.getDom());
	}

	listener() {
		window.addEventListener('popstate', () => {
			const routeArr = location.pathname.replace('/', '').split('/');
			const serviceId = parseInt(routeArr[0]);
			const yearAndMonth = routeArr[1].split('-');
			const year = parseInt(yearAndMonth[0]);
			const month = parseInt(yearAndMonth[1]);
			const viewName = routeArr[2];
			const popData: popstateType = { serviceId, year, month, viewName };
			ActionManager.notify('popstate', popData);
		});
	}
}

new App();
