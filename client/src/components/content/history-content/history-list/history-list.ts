import { AbstractContent, History } from '../../abstract-content';

type DailyListType = {
	day: number;
	dailyHistory: History[];
};

export default class HistoryList extends AbstractContent {
	dom: HTMLElement;
	list: HTMLElement;

	constructor() {
		super();
		this.dom = document.createElement('div');
		this.dom.classList.add('history-list');
		this.list = document.createElement('ol');
		this.init();
	}

	init() {
		this.render();
		this.list.id = 'history-list';
		this.dom.appendChild(this.list);
	}

	render() {
		this.dom.innerHTML = `
        <input type="checkbox" /> <span>내용</span> <span>2000원</span>
        <input type="checkbox" /> <span>지출</span> <span>2000원</span>
        `;
	}

	load(histories: History[]): void {
		/**
		 * 테이블 태그 정리
		 */
		groupByDay(histories).forEach((today) => {
			const todayLi = document.createElement('li');

			const sum = today.dailyHistory.reduce(
				({ earned, spent }, h) => {
					if (h.price > 0) return { earned: earned + h.price, spent };
					else return { earned, spent: spent - h.price };
				},
				{ earned: 0, spent: 0 }
			);
			todayLi.appendChild(createTodayHeader(today.dailyHistory[0].historyDate, sum));

			const todayList = document.createElement('ol');
			today.dailyHistory.forEach((history) => {
				const historyLi = createHistoryLi(history);
				todayList.appendChild(historyLi);
			});
			todayLi.appendChild(todayList);
			document.getElementById('history-list')!.appendChild(todayLi);
		});
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
	${typeof sum.earned === 'number' ? `<div class="hheader-price earned">+${sum.earned}</div>` : ''}
	${typeof sum.spent === 'number' ? `<div class="hheader-price spent">-${sum.spent}</div>` : ''}`;
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
	<div class="hitem-price">${history.price}</div>
	`;
	return list;
}
