import Component from '../component';
import ActionManager from '../../utils/action-manager';
import { popstateType } from '../../index';
import TabName from '../../utils/tab-name';

interface TabSelectorState {
	tabs: Array<string>;
	currentTab: string;
}

export default class TabSelector extends Component {
	dom: HTMLElement;
	private state: TabSelectorState;

	constructor(state: TabSelectorState) {
		super();
		this.dom = document.createElement('div');
		this.state = state;
		this.init();
		this.initEventManager();
	}

	init(): void {
		this.dom.classList.add('tab-selector');
		this.render();
		this.listener();
		this.setHighlight(this.state.currentTab);
	}

	private initEventManager() {
		ActionManager.subscribe('popstate', (data: popstateType) => {
			const tabName = TabName[data.viewName];
			this.setHighlight(tabName);
		});
	}

	listener() {
		this.dom.addEventListener('click', (evt: Event) => {
			const targetDom = evt.target as HTMLElement;
			const tabName = targetDom.dataset.name;
			if (!tabName) return;
			const viewName = TabName[tabName];
			ActionManager.notify('changeTab', { viewName });
			this.setHighlight(tabName);
		});
	}

	//TODO 위치 조절 필요
	setHighlight(page: string) {
		const index = this.state.tabs.indexOf(page);
		if (index < 0) return;
		this.state.currentTab = page;
		const highlight = this.dom.querySelector('.tab-highlight') as HTMLElement;
		highlight.style.transform = `translateX(${index * 5}rem)`;
		//TODO style -> css로 넣어야됩니다.
	}

	render(): void {
		this.dom!.innerHTML = `
		<div class="tab-highlight"></div>
		<ul>
			${this.state.tabs
				.map(
					(tab) => `
					<li data-name="${tab}">${tab}</li>
				`
				)
				.join('')}
		</ul>
		`;
	}
}
