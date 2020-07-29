import Header from './components/header';
import MainPanel from './components/main-panel';
import './global.scss';
import PieChart from './components/content/statistics-content/pie-chart';
class App {
	private container: HTMLElement;
	constructor(contianer: HTMLElement) {
		this.container = contianer;
		this.init();
	}

	init() {
		this.container.appendChild(new Header().getDom());
		this.container.appendChild(new MainPanel().getDom());
		this.container.appendChild(
			new PieChart([
				{ color: 'yellow', name: '1', weight: 9 },
				{ color: 'red', name: '2', weight: 3 },
				{ color: 'green', name: '3', weight: 1 },
				{ color: 'purple', name: '4', weight: 2 },
			]).getDom()
		);
	}
}

new App(document.getElementById('app') as HTMLElement);
