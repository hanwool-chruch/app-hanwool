import './styles/global.scss';
import Header from './components/header';
import MainPanel from './components/main-panel';
<<<<<<< HEAD
=======
import './global.scss';
>>>>>>> 4a7a54a334e72608f1a071fe09ba6f84b6c465d7
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
				{ color: 'yellow', name: '콩밥', weight: 9 },
				{ color: 'red', name: '설탕', weight: 3 },
				{ color: 'green', name: 'HTTP', weight: 1 },
				{ color: 'purple', name: '스케이트', weight: 2 },
			]).getDom()
		);
	}
}

new App(document.getElementById('app') as HTMLElement);
