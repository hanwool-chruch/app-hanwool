import Component from '../component';

export default class MonthSelector extends Component {
	private month: number;
	private onMoveMonth: (diffMonth: number) => number;
	// TODO: display year
	/**
	 *
	 * @param month {number} - Current month
	 * @param onMoveMonth {diffMonth: number => number} - gets month difference respect to current one, reterns new month
	 */
	constructor(month: number, onMoveMonth: (diffMonth: number) => number) {
		super();
		this.dom = document.createElement('div');
		this.dom.classList.add('month-selector');
		this.month = month;
		this.onMoveMonth = onMoveMonth;
		this.init();
	}

	init(): void {
		this.render();
		this.dom?.querySelector('#goto_prev_month_button')?.addEventListener('click', () => {
			this.month = this.onMoveMonth(-1);
			this.init();
		});

		this.dom?.querySelector('#goto_next_month_button')?.addEventListener('click', () => {
			this.month = this.onMoveMonth(1);
			this.init();
		});
	}

	render(): void {
		this.dom!.innerHTML = `
        <button id="goto_prev_month_button">◁</button>
        <span>${this.month} 월</span>
        <button id="goto_next_month_button">▷</button>
        `;
	}
}
