import './styles/global.scss';

import Router from './router';
import Component from './components/component';
import ServicePage from './pages/service-page';
import LoginPage from './pages/login-page';
import SignupPage from './pages/signup-page';
import NotFoundPage from './pages/not-found-page';
import ActionManager, { POP_STATE_ACTION } from './utils/action-manager';

export interface popstateType {
	serviceId: number;
	year: number;
	month: number;
	viewName: string;
}
class App {
	private container: HTMLElement;
	private pages: Map<string, Component>;

	constructor() {
		this.container = document.getElementById('app') as HTMLElement;
		this.pages = new Map();
		this.init();
	}

	init() {
		this.initEventManager();
		this.initPages();
		Router.init();
		this.listener();
	}

	initPages() {
		const servicePage = new ServicePage();
		const loginPage = new LoginPage();
		const signupPage = new SignupPage();
		const notFoundPage = new NotFoundPage();

		this.pages.set('service', servicePage);
		this.pages.set('login', loginPage);
		this.pages.set('signup', signupPage);
		this.pages.set('not-found', notFoundPage);
	}

	initEventManager() {
		Router.subscribe({ key: 'loadPage', observer: (data) => this.changePage(data.pageName) });
	}

	changePage(page: string) {
		if (this.pages.has(page)) {
			const newPage = this.pages.get(page);
			while (this.container.childElementCount !== 0) {
				this.container.lastElementChild?.remove();
			}
			this.container.appendChild(newPage!.getDom());
		} else {
			const newPage = this.pages.get('not-found');
			while (this.container.childElementCount !== 0) {
				this.container.lastElementChild?.remove();
			}
			this.container.appendChild(newPage!.getDom());
		}
	}

	listener() {
		window.addEventListener('popstate', () => {
			const route = location.pathname.replace('/', '');
			try {
				const routeArr = route.split('/');
				const serviceId = parseInt(routeArr[0]);
				const yearAndMonth = routeArr[1].split('-');
				const year = parseInt(yearAndMonth[0]);
				const month = parseInt(yearAndMonth[1]);
				const viewName = routeArr[2];
				const popData: popstateType = { serviceId, year, month, viewName };
				ActionManager.notify({ key: POP_STATE_ACTION, data: popData });
			} catch (err) {
				this.changePage(route);
			}
		});
	}
}

new App();
