import { AbstractContent } from '../abstract-content';
import { History } from '@shared/dto/history-dto';
import DailyView from './daily-view';
import CategoryView from './category-view';

export default class StatisticsContent extends AbstractContent {
	data: History[] = [];
	dom: HTMLElement;

	private curView: AbstractContent | null = null;
	private views: AbstractContent[] = [];

	constructor() {
		super();
		this.dom = document.createElement('div');
		this.init();
	}

	init() {
		this.dom.classList.add('statistics-content');
		this.dom.innerHTML = `
		<div class="flex-spacebetween stat-view-header">
			<div id="stat-view-select">
				<label><input type="radio" name="stat-view" value="category" checked>카테고리별 지출</label>
				<label><input type="radio" name="stat-view" value="daily">일별 지출</label>
			</div>
			<div id="statistics-content-monthly-spent">
			</div>
		</div>
		<div id="stat-view">
		</div>
		`;
		this.listener();

		this.views.push(new CategoryView());
		this.views.push(new DailyView());
		this.curView = this.views[0];
		this.updateView();
	}

	// add event listeners
	private listener() {
		const viewRadio = this.dom.querySelector('#stat-view-select');
		viewRadio?.addEventListener('change', (evt: any) => {
			switch (evt.target.value) {
				case 'category':
					if (this.curView === this.views[0]) return;
					this.curView = this.views[0];
					break;
				case 'daily':
					if (this.curView === this.views[1]) return;
					this.curView = this.views[1];
					break;
				default:
					throw new Error('Invalid stat view name: ' + evt.target.value);
			}
			this.updateView();
		});
	}

	private render() {}

	private updateView() {
		const view = this.dom.querySelector('#stat-view') as HTMLDivElement;
		view.innerHTML = '';
		view.appendChild(this.curView!.getDom());
	}

	/**
	 *
	 * @param histories {History[]} - should have at leat one item to render calendar
	 */
	load(histories: History[]): void {
		this.views.forEach((view) => view.load(histories));
		const spentOfTheMonth = histories
			.filter((h) => h.price < 0)
			.reduce((acc: number, p) => acc - p.price, 0);

		this.dom.querySelector(
			'#statistics-content-monthly-spent'
		)!.innerHTML = `이번달에 쓴 돈: ${spentOfTheMonth.toLocaleString()} 원`;
	}
}
