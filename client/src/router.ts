import { AbstractContent } from './components/content/abstract-content';
import NotFoundPage from './pages/not-found';
import { History } from '@shared/dto/history-dto';

const testHistory: History[] = [
	{
		category: '밥',
		historyDate: new Date('2020-08-01'),
		content: '순댓국',
		id: 1,
		payment: '외상',
		price: -4000,
	},
	{
		category: '주식',
		historyDate: new Date('2020-08-01'),
		content: '상장폐지',
		id: 2,
		payment: '주식',
		price: -5000,
	},
	{
		category: '밥',
		historyDate: new Date('2020-08-01'),
		content: '순댓국1',
		id: 3,
		payment: '외상',
		price: -3000,
	},
	{
		category: '일',
		historyDate: new Date('2020-08-03'),
		content: '부업',
		id: 4,
		payment: '현금',
		price: 6000,
	},
];

interface View {
	viewName: string;
	component: AbstractContent;
}

interface CurrentData {
	serviceId: number;
	yearAndMonth: string;
	page: string;
}

class Router {
	private views: Map<String, AbstractContent>;
	private root: string;
	private current: CurrentData;

	constructor(pages: Array<View>) {
		this.views = new Map<String, AbstractContent>();
		this.root = '/';
		const now = new Date();
		this.current = {
			serviceId: 1,
			yearAndMonth: now.getFullYear() + '-' + now.getMonth() + 1,
			page: 'history',
		};
		this.init(pages);
	}

	private async init(pages: Array<View>) {
		pages.forEach((page) => this.addView(page.viewName, page.component));

		const routeArr = location.pathname.replace(this.root, '').split('/');
		if (routeArr.length !== 3) {
			this.loadView('not-found');
			return;
		}

		const serviceId = parseInt(routeArr[0], 16) - 3000;
		const yearAndMonth = routeArr[1];
		const page = routeArr[2];

		await this.loadHistoryData(yearAndMonth, serviceId);
		this.loadView(page);
		this.updateCurrentUrl();
	}

	private addView(viewName: string, component: AbstractContent): void {
		this.views.set(viewName, component);
	}

	private getView(viewName: string): AbstractContent | null {
		if (this.views.has(viewName)) {
			return this.views.get(viewName) as AbstractContent;
		} else {
			return null;
		}
	}

	public loadView(page: string) {
		const mainPanel = document.querySelector('main') as HTMLElement;
		const matchedView = this.getView(page);
		if (matchedView) {
			while (mainPanel.childElementCount !== 2) {
				mainPanel.lastElementChild?.remove();
			}
			mainPanel.appendChild(matchedView.getDom());
			this.current.page = page;
		} else {
			const app = document.querySelector('#app') as HTMLElement;
			const url = `${this.root}not-found`;
			app.innerHTML = NotFoundPage.innerHTML;
			history.pushState({}, '', url);
		}
	}

	public async loadHistoryData(
		yearAndMonth: string = this.current.yearAndMonth,
		serviceId: number = this.current.serviceId
	) {
		//todo 뷰의 데이터 전부 로드
		this.views.get(this.current.page)!.load(testHistory);

		this.current.serviceId = serviceId;
		this.current.yearAndMonth = yearAndMonth;
	}

	public updateCurrentUrl() {
		console.info(
			'pushstate',
			`${this.root}${(this.current.serviceId + 3000).toString(16)}/${this.current.yearAndMonth}/${
				this.current.page
			}`
		);
		history.pushState(
			null,
			'',
			`${this.root}${(this.current.serviceId + 3000).toString(16)}/${this.current.yearAndMonth}/${
				this.current.page
			}`
		);
	}

	public setCurrent(current: CurrentData) {
		this.current = current;
	}

	public getCurrentYearAndMonth() {
		return this.current.yearAndMonth;
	}
}

export { View };
export default Router;
