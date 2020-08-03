import Component from '../component';

export default class TabSelector extends Component {
	// Remove hardcoded tab data
	dom: HTMLElement;
	private tabs: string[] = ['내역', '달력', '통계'];
	private onMoveTab: (tab: string) => void;
	constructor(onMoveTab: (tab: string) => void) {
		super();
		this.dom = document.createElement('div');
		this.dom.classList.add('tab-selector');
		this.onMoveTab = onMoveTab;
		this.init();
	}

	init(): void {
		this.render();
		this.listener();
	}

	listener() {
		this.dom.addEventListener('click', (evt: Event) => {
			const targetDom = evt.target as HTMLElement;
			const tabName = targetDom.dataset.name;
			if (!tabName) return;
			this.onMoveTab(tabName);
			this.setHighlight(tabName);
		});
	}

	//TODO 위치 조절 필요
	setHighlight(page: string) {
		const index = this.tabs.indexOf(page);
		const highlight = this.dom.querySelector('.tab-highlight') as HTMLElement;
		highlight.style.transform = `translateX(${index * 5}rem)`;
		//TODO style -> css로 넣어야됩니다.
	}

	render(): void {
		this.dom!.innerHTML = `
		<div class="tab-highlight"></div>
		<ul>
			${this.tabs
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
