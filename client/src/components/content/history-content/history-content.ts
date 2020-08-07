import Editor from './editor';
import HistoryList from './history-list';
import { AbstractContent } from '../abstract-content';
import { History } from '@shared/dto/history-dto';

export default class HistoryContent extends AbstractContent {
	dom: HTMLElement;
	historyList: HistoryList;
	editor: Editor;

	constructor() {
		super();
		this.dom = document.createElement('div');
		this.editor = new Editor();
		this.historyList = new HistoryList();
		this.init();
	}

	init() {
		this.dom.classList.add('history-content');
		this.dom.appendChild(this.editor.getDom());
		this.dom.appendChild(this.historyList.getDom());
	}

	load(histories: History[]): void {
		this.historyList.load(histories);
	}

	reload(serviceId: number) {
		this.editor.setServiceId(serviceId);
		this.editor.reload();
	}
}
