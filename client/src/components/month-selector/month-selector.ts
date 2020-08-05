import Component from '../component';
import ActionManager from '../../utils/action-manager';
import { popstateType } from '../../index';

export interface MonthSelectorState {
	year: number;
	month: number;
}

export default class MonthSelector extends Component {
	private state: MonthSelectorState;
	dom: HTMLElement;

	constructor(state: MonthSelectorState) {
		super();
		this.dom = document.createElement('div');
		this.state = state;
		this.init();
	}

	init(): void {
		this.dom.classList.add('month-selector');
		this.render();
		this.listener();
		this.initEventManager();
	}

	private initEventManager() {
		ActionManager.subscribe({
			key: 'popstate',
			observer: (data: popstateType) => {
				this.setYearAndMonth({ year: data.year, month: data.month });
			},
		});
	}

	listener() {
		const prevBtn = this.dom.querySelector('#goto_prev_month_button') as HTMLButtonElement;
		const nextBtn = this.dom.querySelector('#goto_next_month_button') as HTMLButtonElement;
		const monthArea = this.dom.querySelector('span') as HTMLSpanElement;

		prevBtn.addEventListener('click', () => {
			this.state.month--;
			if (this.state.month === 0) {
				this.state.year--;
				this.state.month = 12;
			}
			monthArea.innerHTML = `${this.state.year}년 ${this.state.month} 월`;
			ActionManager.notify({ key: 'changeDate', data: this.state });
		});

		nextBtn.addEventListener('click', () => {
			this.state.month++;
			if (this.state.month === 13) {
				this.state.year++;
				this.state.month = 1;
			}
			monthArea.innerHTML = `${this.state.year}년 ${this.state.month} 월`;
			ActionManager.notify({ key: 'changeDate', data: this.state });
		});
	}

	render(): void {
		this.dom.innerHTML = `
        <button id="goto_prev_month_button">◁</button>
        <span>${this.state.year}년 ${this.state.month} 월</span>
        <button id="goto_next_month_button">▷</button>
        `;
	}

	public setYearAndMonth(state: MonthSelectorState) {
		this.state = state;
		const monthArea = this.dom.querySelector('span') as HTMLSpanElement;
		monthArea.innerHTML = `${this.state.year}년 ${this.state.month} 월`;
	}
}
