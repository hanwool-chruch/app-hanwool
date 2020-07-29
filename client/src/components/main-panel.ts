import HistoryContent from './content/history-content/history-content';
import Component from './component';
import { History } from './content/abstract-content';
import { AbstractContent } from './content/abstract-content';

//날짜로 오름차순
const testHistory: History[] = [
	{
		category: '밥',
		historyDate: new Date('2020-08-01'),
		content: '순댓국',
		id: 1,
		payment: '외상',
		price: -4000,
	},
	{
		category: '주식',
		historyDate: new Date('2020-08-01'),
		content: '상장폐지',
		id: 2,
		payment: '주식',
		price: -5000,
	},
	{
		category: '밥',
		historyDate: new Date('2020-08-01'),
		content: '순댓국1',
		id: 3,
		payment: '외상',
		price: -3000,
	},
	{
		category: '일',
		historyDate: new Date('2020-08-03'),
		content: '부업',
		id: 4,
		payment: '현금',
		price: 6000,
	},
];
export default class MainPanel extends Component {
	dom: HTMLElement;
	contents: Array<AbstractContent> = [];

	constructor() {
		super();
		this.dom = document.createElement('div');
		this.init();
	}

	init() {
		this.contents.push(new HistoryContent());
		this.dom.appendChild(this.contents[0].getDom());
		/**
		 * todo
		 * 달력 content, 통계 content appendChild
		 */
		this.contents[0].load(testHistory);
	}
}
