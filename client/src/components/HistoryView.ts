import Editor from './Editor';
import HistoryList from './HistoryList';
import { Component } from './Header';

export type History = {
	id: number;
	price: number;
	content: string;
	historyDate: Date;
	category: string;
	payment: string;
};

export interface IView {
	load(histories: History[]): void;
}
export default class HistoryView extends Component implements HistoryView {
	data: History[] | null = null;
	historyView: IView;

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
