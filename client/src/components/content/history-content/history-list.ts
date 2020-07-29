import Component from '../../component';
import { IContent, History } from '../icontent';

type HistoryListType = {
	date: number;
	data: History[];
};

export default class HistoryList extends Component implements IContent {
	list: HTMLElement;
	constructor() {
		super();
		this.dom = document.createElement('div');
		this.dom.innerHTML = `
        <input type="checkbox" /> <span>내용</span> <span>2000원</span>
        <input type="checkbox" /> <span>지출</span> <span>2000원</span>
        `;
		this.list = document.createElement('div');
		this.list.id = 'history-list';
		this.dom.appendChild(this.list);

		const div = document.createElement('div');
		div.innerText = 'asdf';
		this.list.appendChild(div);
	}

	load(histories: History[]): void {
		this.zipHistory(histories).forEach((today) => {
			const div = document.createElement('div');
			div.innerText = today.date + '';
			const list = document.getElementById('history-list') as HTMLElement;
			list.appendChild(div);
			this.list.appendChild(document.createElement('input'));
		});
	}

	private zipHistory(histories: History[]): HistoryListType[] {
		return histories.reduce((acc: HistoryListType[], h: History) => {
			// 그 날이 없으면 그 날 새로 만들기
			if (acc.length === 0 || acc[0].date !== h.historyDate.getDate()) {
				acc.push({
					date: h.historyDate.getDate(),
					data: [h],
				});
				// 있는 날에 추가
			} else {
				acc[0].data.push(h);
			}
			return acc;
		}, []);
	}
}
