import Header from '../../components/header';
import MainPanel from '../../components/main-panel';
import Component from '../../components/component';

export interface popstateType {
	serviceId: number;
	year: number;
	month: number;
	viewName: string;
}
class ServicePage extends Component {
	dom: HTMLElement;
	private header: Header;
	private mainPanel: MainPanel;

	constructor() {
		super();
		this.dom = document.createElement('div') as HTMLElement;
		this.header = new Header();
		this.mainPanel = new MainPanel();
		this.init();
	}

	init() {
		this.dom.classList.add('service-page');

		this.dom.appendChild(this.header.getDom());
		this.dom.appendChild(this.mainPanel.getDom());
	}

	getDom() {
		return this.dom;
	}
}

export default ServicePage;
