import { AbstractContent } from '../abstract-content';
import { History } from '@shared/dto/history-dto';

export default class CalendarContent extends AbstractContent {
	data: History[] | null = null;

	constructor() {
		super();
		this.dom = document.createElement('div');
		this.init();
	}

	init() {
		this.dom!.classList.add('calendar-content');
		this.dom!.innerHTML = `
		<div class="calendar-list-filter">
			<div class="label-checkbox earned">
				<input type="checkbox" id="calendar-list-earned-checkbox" checked />
				<label for="calendar-list-earned-checkbox"><span>수입</span> <span id="calendar-filter-earned-amount">0 원</span></label>
			</div>
			<div class="label-checkbox spent">
				<input type="checkbox" id="calendar-list-spent-checkbox" checked />
				<label for="calendar-list-spent-checkbox"><span>지출</span> <span id="calendar-filter-spent-amount">0 원</span></label>
			</div>
		</div>
		<div id="calendar-grid">
			<div>1</div>
			<div>1</div>
			<div>1</div>
			<div>1</div>
			<div>1</div>
			<div>1</div>
			<div>1</div>
			<div>1</div>
			<div>1</div>
			<div>1</div>
			<div>1</div>
		</div>
		`;
	}

	load(histories: History[]): void {
		if (this.data === histories) return;

		this.data = histories;
	}
}

function getLastDate(date: Date) {
	return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}
