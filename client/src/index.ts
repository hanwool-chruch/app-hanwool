import Header from './components/Header';
import MainPanel from './components/MainPanel';
class App {
	private container: HTMLElement;
	constructor(contianer: HTMLElement) {
		this.container = contianer;
		this.container.appendChild(new Header().getDom());
		this.container.appendChild(new MainPanel().getDom());
	}
}

new App(document.getElementById('app') as HTMLElement);
