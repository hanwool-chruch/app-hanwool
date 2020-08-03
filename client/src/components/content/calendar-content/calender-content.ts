import { AbstractContent } from '../abstract-content';
import { History } from '@shared/dto/history-dto';
import { groupByDate, calcTotal } from '../../../utils';

export default class CalendarContent extends AbstractContent {
	data: History[] = [];

	private filter: {
		earned: boolean;
		spent: boolean;
	};

	constructor() {
		super();
		this.dom = document.createElement('div');
		this.filter = { earned: true, spent: true };
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
		</div>
		`;
		this.listener();
	}

	// add event listeners
	private listener() {
		const earnedCheckbox = this.dom!.querySelector(
			'#calendar-list-earned-checkbox'
		) as HTMLInputElement;
		earnedCheckbox.addEventListener('change', () => {
			this.filter.earned = earnedCheckbox.checked;
			this.render();
		});

		const spentCheckbox = this.dom!.querySelector(
			'#calendar-list-spent-checkbox'
		) as HTMLInputElement;
		spentCheckbox.addEventListener('change', () => {
			this.filter.spent = spentCheckbox.checked;
			this.render();
		});
	}

	private render() {
		const grid = this.dom!.querySelector('#calendar-grid') as HTMLDivElement;
		grid.innerHTML = `
		<div class="red">일</div>
		<div>월</div>
		<div>화</div>
		<div>수</div>
		<div>목</div>
		<div>금</div>
		<div>토</div>
		`;

		// What if there's no history in this month?
		// Representitive date of the month
		const refDate = this.data!.length > 0 ? this.data![0].historyDate : (new Date() as Date);

		const firstDateOfMonth = new Date(refDate.getFullYear(), refDate.getMonth(), 1);
		const lastDateOfMonth = new Date(refDate.getFullYear(), refDate.getMonth() + 1, 0);

		const iterDate = new Date(firstDateOfMonth.getTime());
		iterDate.setDate(iterDate.getDate() - iterDate.getDay());
		while (iterDate.getDate() !== 1) {
			grid.innerHTML += createCalendarItem(iterDate, true);
			iterDate.setDate(iterDate.getDate() + 1);
		}
		while (iterDate.getMonth() === lastDateOfMonth.getMonth()) {
			grid.innerHTML += createCalendarItem(iterDate, false);
			iterDate.setDate(iterDate.getDate() + 1);
		}
		while (iterDate.getDay() !== 0) {
			grid.innerHTML += createCalendarItem(iterDate, true);
			iterDate.setDate(iterDate.getDate() + 1);
		}

		this.addDaySummary();
	}

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
