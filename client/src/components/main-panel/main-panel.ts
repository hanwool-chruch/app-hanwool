import HistoryContent from '../content/history-content';
import Component from '../component';
import { AbstractContent } from '../content/abstract-content';
import MonthSelector from '../month-selector';
import TabSelector from '../tab-selector';
import HistoryModel from '../../models/history-model';

export default class MainPanel extends Component {
	dom: HTMLElement;
	contents: AbstractContent[] = [];
	//TODO resolve dependency
	historyModel?: HistoryModel;

	constructor() {
		super();
		this.dom = document.createElement('main');
		this.dom.classList.add('main-panel');
		this.init();
	}

	init() {
		// TODO: resolve dependency
		// first parameter of conttructor of HistoryModel is service id
		// default servide id is 1, for now.
		this.historyModel = new HistoryModel(1);
		this.historyModel.subscribe((data) => {
			this.contents[0].load(data);
		});

		let curMonth = 6;
		const monthSelector = new MonthSelector(6, (diff: number) => {
			curMonth += diff;
			return curMonth;
		});

		const tabSelector = new TabSelector((tab) => {
			console.log(tab);
			alert(`Move to ${tab} tab`);
		});

		this.getDom().appendChild(monthSelector.getDom());
		this.getDom().appendChild(tabSelector.getDom());
		this.contents.push(new HistoryContent());
		this.dom.appendChild(this.contents[0].getDom());
	}
}
