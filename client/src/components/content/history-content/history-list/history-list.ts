import { AbstractContent } from '../../abstract-content';
import { History } from '@shared/dto/history-dto';

type DailyListType = {
	day: number;
	dailyHistory: History[];
};

export default class HistoryList extends AbstractContent {
	dom: HTMLElement;
	private histories: History[] = [];
	private filter: {
		earned: boolean;
		spent: boolean;
	};

	constructor() {
		super();
		this.dom = document.createElement('div');
		this.dom.classList.add('history-list');
		this.filter = { earned: true, spent: true };
		this.init();
	}

	init() {
		this.dom.innerHTML = `
		<div class="history-list-filter">
			<div class="label-checkbox earned">
				<input type="checkbox" id="history-list-earned-checkbox" checked />
				<label for="history-list-earned-checkbox"><span>수입</span> <span id="history-filter-earned-amount">0 원</span></label>
			</div>
			<div class="label-checkbox spent">
				<input type="checkbox" id="history-list-spent-checkbox" checked />
				<label for="history-list-spent-checkbox"><span>지출</span> <span id="history-filter-spent-amount">0 원</span></label>
			</div>
		</div>
		<ol id="history-list"></ol>
		`;

		this.listener();
	}

	private listener() {
		const earnedCheckbox = this.dom.querySelector(
			'#history-list-earned-checkbox'
		) as HTMLInputElement;
		earnedCheckbox.addEventListener('change', () => {
			this.filter.earned = earnedCheckbox.checked;
			this.updateList();
		});

		const spentCheckbox = this.dom.querySelector(
			'#history-list-spent-checkbox'
		) as HTMLInputElement;
		spentCheckbox.addEventListener('change', () => {
			this.filter.spent = spentCheckbox.checked;
			this.updateList();
		});
	}

	private updateList() {
		const list = this.dom.querySelector('#history-list') as HTMLOListElement;
		while (list.hasChildNodes()) list.removeChild(list.firstChild!);

		const totalSum = calcTotal(this.histories);

		const earnedLabel = this.dom.querySelector('#history-filter-earned-amount') as HTMLLabelElement;
		earnedLabel.innerText = `${totalSum.earned.toLocaleString()} 원`;

		const spentLabel = this.dom.querySelector('#history-filter-spent-amount') as HTMLLabelElement;
		spentLabel.innerText = `${totalSum.spent.toLocaleString()} 원`;

		const histories = this.histories.filter((h) => {
			if (h.price > 0) return this.filter.earned;
			else return this.filter.spent;
		});

		for (const today of groupByDay(histories)) {
			const todayLi = document.createElement('li');

			const sum = calcTotal(today.dailyHistory);
			todayLi.appendChild(createTodayHeader(today.dailyHistory[0].historyDate, sum));

			const todayList = document.createElement('ol');
			today.dailyHistory.forEach((history) => {
				const historyLi = createHistoryLi(history);
				todayList.appendChild(historyLi);
			});
			todayLi.appendChild(todayList);

			list.appendChild(todayLi);
		}
	}

	load(histories: History[]): void {
		/**
		 * 테이블 태그 정리
		 */
		this.histories = histories;
		this.updateList();
	}
}

function groupByDay(histories: History[]): DailyListType[] {
	return histories.reduce((acc: DailyListType[], curHistory: History) => {
		// 그 날이 없으면 그 날 새로 만들기
		if (acc.length === 0 || acc[0].day !== curHistory.historyDate.getDate()) {
			acc.push({
				day: curHistory.historyDate.getDate(),
				dailyHistory: [curHistory],
			});
			// 있는 날에 추가
		} else {
			acc[0].dailyHistory.push(curHistory);
		}
		return acc;
	}, []);
}
const days = ['일', '월', '화', '수', '목', '금', '토'];

function createTodayHeader(date: Date, sum: { earned?: number; spent?: number }): HTMLDivElement {
	const header = document.createElement('div');
	header.classList.add('history-today-header');
	header.innerHTML = `
	<div class="hheader-date">${date.getMonth()} 월 ${date.getDate()} 일</div>
	<div class="hheader-day">${days[date.getDate()]}</div>
	${
		typeof sum.earned === 'number'
			? `<div class="hheader-price earned">${formatPrice(sum.earned, true)}</div>`
			: ''
	}
	${
		typeof sum.spent === 'number'
			? `<div class="hheader-price spent">${formatPrice(sum.spent, false)}</div>`
			: ''
	}`;
	return header;
}

function createHistoryLi(history: History): HTMLLIElement {
	const list = document.createElement('li');
	list.classList.add('history-item');
	list.classList.add(history.price > 0 ? 'earned' : 'spent');
	// list.innerText = history.category + history.content + history.payment + history.price;
	list.innerHTML = `
	<div class="hitem-category">${history.category}</div>
	<div class="hitem-content">${history.content}</div>
	<div class="hitem-payment">${history.payment}</div>
	<div class="hitem-price">${formatPrice(history.price)}</div>
	`;
	return list;
}

function formatPrice(price: number, earned?: boolean): string {
	if (typeof earned === 'undefined')
		return `${price > 0 ? '+' : '-'}${Math.abs(price).toLocaleString()}원`;
	return `${earned ? '+' : '-'}${Math.abs(price).toLocaleString()}원`;
}

function calcTotal(histories: History[]): { earned: number; spent: number } {
	return histories.reduce(
		({ earned, spent }, h) => {
			if (h.price > 0) return { earned: earned + h.price, spent };
			else return { earned, spent: spent - h.price };
		},
		{ earned: 0, spent: 0 }
	);
}
