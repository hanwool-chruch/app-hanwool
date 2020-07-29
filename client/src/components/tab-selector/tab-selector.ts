import Component from '../component';

export default class TabSelector extends Component {
	private tabs: string[] = ['내역', '달력', '통계'];
	private curTab: string;
	private onMoveTab: (tab: string) => void;
	constructor(onMoveTab: (tab: string) => void) {
		super();
		this.dom = document.createElement('ul');
		this.dom.classList.add('tab-selector');
		this.curTab = '';
		this.onMoveTab = onMoveTab;
		this.init();
	}

	init(): void {
		this.render();
		this.dom?.addEventListener('click', (evt: any) => {
			const tabName = evt.target.dataset.name;
			if (tabName) this.onMoveTab(tabName);
		});
	}

	render(): void {
		this.dom!.innerHTML = `
			${this.tabs
				.map(
					(tab) => `
					<li data-name="${tab}">${tab}</li>
				`
				)
				.join('')}
        `;
	}
}
