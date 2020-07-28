import Editor from './Editor';
import HistoryList from './HistoryList';

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
export default class HistoryView implements HistoryView {
	data: History[] | null = null;
	dom: HTMLElement;
	historyView: IView;

	constructor() {
		this.dom = document.createElement('div');
		this.dom.appendChild(new Editor().dom);
		this.historyView = new HistoryList();
		this.dom.appendChild(new HistoryList().dom);
	}

	load(histories: History[]): void {
		if (!this.data) {
			this.data = histories;
		}

		this.historyView.load(this.data);
	}
}
