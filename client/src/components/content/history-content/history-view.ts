import Editor from './editor';
import HistoryList from './history-list';
import Component from '../../component';
import { IContent, History } from '../icontent';

export default class HistoryView extends Component implements IContent {
	data: History[] | null = null;
	historyView: IContent;

	constructor() {
		super();
		this.dom = document.createElement('div');
		this.dom.appendChild(new Editor().getDom());
		this.historyView = new HistoryList();
		this.dom.appendChild(new HistoryList().getDom());
	}

	load(histories: History[]): void {
		if (!this.data) {
			this.data = histories;
		}

		this.historyView.load(this.data);
	}
}
