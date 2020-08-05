import { AbstractContent } from '../abstract-content';
import { History } from '@shared/dto/history-dto';

export default class DailyView extends AbstractContent {
	dom: HTMLElement;

	constructor() {
		super();
		this.dom = document.createElement('div');
		this.init();
	}

	init() {
		this.dom.classList.add('daily-stat-view');
		this.dom.innerHTML = `
        Day
		`;
		this.listener();
	}

	// add event listeners
	private listener() {}

	private render() {}

	/**
	 *
	 * @param histories {History[]} - should have at leat one item to render calendar
	 */
	load(histories: History[]): void {
		this.render();
	}
}

// function createCalendarItem(date: Date, gray: boolean) {
// 	let className = '';
// 	if (gray) className = 'gray';
// 	else if (isToday(date)) className = 'today';
// 	else if (isSunday(date)) className = 'red';
// 	return `<div id="${createIdOfDay(date)}" class="cal-item ${className}">
// 		<div class="cal-date-div">
// 		${date.getDate()}
// 		</div>
// 	</div>`;
// }

// function groupByDate(histories: History[]): DailyListType[] {
// 	return histories.reduce((acc: DailyListType[], curHistory: History) => {
// 		// 그 날이 없으면 그 날 새로 만들기
// 		if (acc.length === 0 || acc[0].day !== curHistory.historyDate.getDate()) {
// 			acc.push({
// 				day: curHistory.historyDate.getDate(),
// 				dailyHistory: [curHistory],
// 			});
// 			// 있는 날에 추가
// 		} else {
// 			acc[0].dailyHistory.push(curHistory);
// 		}
// 		return acc;
// 	}, []);
// }
