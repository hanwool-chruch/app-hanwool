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
		this.groupByDay(histories).forEach((today) => {
			const todayLi = document.createElement('ol');
			todayLi.innerText = today.day + '일';

			today.dailyHistory.forEach((history) => {
				const historyLi = document.createElement('li');
				historyLi.innerText =
					history.historyDate.toDateString() +
					history.category +
					history.content +
					history.payment +
					history.price;
				todayLi.appendChild(historyLi);
			});
			this.list.appendChild(todayLi);
		});
	}

	private groupByDay(histories: History[]): DailyListType[] {
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
}
