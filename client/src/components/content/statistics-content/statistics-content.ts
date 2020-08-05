import { AbstractContent } from '../abstract-content';
import { History } from '@shared/dto/history-dto';
import { groupByDate, calcTotal } from '../../../utils';

export default class StatisticsContent extends AbstractContent {
	data: History[] = [];

	private filter: {
		earned: boolean;
		spent: boolean;
	} = { earned: true, spent: true };

	constructor() {
		super();
		this.dom = document.createElement('div');
		this.init();
	}

	init() {
		this.dom!.classList.add('calendar-content');
		this.dom!.innerHTML = `
		<div class="calendar-list-filter">
			<label><input type="radio" name="stat-view" value="apple">일별 지출</label>
      		<label><input type="radio" name="stat-view" value="banana">카테고리별 지출</label>
		</div>
		<div id="stat-view">
		</div>
		`;
		this.listener();
	}

	// add event listeners
	private listener() {
		// const spentCheckbox = this.dom!.querySelector(
		// 	'#calendar-list-spent-checkbox'
		// ) as HTMLInputElement;
		// spentCheckbox.addEventListener('change', () => {
		// 	this.filter.spent = spentCheckbox.checked;
		// 	this.render();
		// });
	}

	private setTotalPrice() {
		const totalPrice = calcTotal(this.data);

		const earnedAmountLabel = this.dom!.querySelector(
			'#calendar-filter-earned-amount'
		) as HTMLSpanElement;
		earnedAmountLabel.innerText = `${totalPrice.earned.toLocaleString()} 원`;

		const spentAmountLabel = this.dom!.querySelector(
			'#calendar-filter-spent-amount'
		) as HTMLSpanElement;
		spentAmountLabel.innerText = `${totalPrice.spent.toLocaleString()} 원`;
	}

	private render() {}

	private addDaySummary() {
		const histories = this.data.filter((h) => {
			if (h.price > 0) return this.filter.earned;
			else return this.filter.spent;
		});

		// 이번달의 결제기록을 날짜별로 묶은 후 그 날의 수입/지출 데이터 추가
		const dateDate = groupByDate(histories).map((dayData) => ({
			...dayData,
			...calcTotal(dayData.dailyHistory),
		}));
		dateDate.forEach((data) => {
			const calItem = this.dom!.querySelector(
				'#' + createIdOfDay(data.dailyHistory[0].historyDate)
			);
			calItem!.innerHTML += `
			<div class="cal-item-price">
				<div class="earned">${data.earned > 0 ? `+ ${data.earned}` : ''}</div>
				<div class="spent">${data.spent > 0 ? `- ${data.spent}` : ''}</div>
			</div>
			`;
		});
	}

	/**
	 *
	 * @param histories {History[]} - should have at leat one item to render calendar
	 */
	load(histories: History[]): void {
		if (this.data === histories) return;

		this.data = histories;
		this.render();
	}
}

function createCalendarItem(date: Date, gray: boolean) {
	let className = '';
	if (gray) className = 'gray';
	else if (isToday(date)) className = 'today';
	else if (isSunday(date)) className = 'red';
	return `<div id="${createIdOfDay(date)}" class="cal-item ${className}">
		<div class="cal-date-div">
		${date.getDate()}
		</div>
	</div>`;
}

function isToday(date: Date) {
	const today = new Date();
	return (
		date.getFullYear() === today.getFullYear() &&
		date.getMonth() === today.getMonth() &&
		date.getDate() === today.getDate()
	);
}

function isSunday(date: Date) {
	return date.getDay() === 0;
}

function createIdOfDay(date: Date) {
	return `cal-item-${date.getMonth() + 1}-${date.getDate()}`;
}
