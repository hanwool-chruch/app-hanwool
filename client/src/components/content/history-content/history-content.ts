import Editor from './editor';
import HistoryList from './history-list';
import { AbstractContent } from '../abstract-content';
import { History } from '@shared/dto/history-dto';

export default class HistoryContent extends AbstractContent {
	data: History[] | null = null;
	historyList: AbstractContent;

	constructor() {
		super();
		this.dom = document.createElement('div');
		this.historyList = new HistoryList();
		this.init();
	}

	init() {
		this.dom?.classList.add('history-content');
		this.dom?.appendChild(new Editor().getDom());
		this.dom?.appendChild(this.historyList.getDom());
	}

	load(histories: History[]): void {
		if (this.data !== histories) {
			this.data = histories;
		}
		this.historyList.load(this.data);
	}
}
