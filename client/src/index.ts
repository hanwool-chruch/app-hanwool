import Header from './components/Header';
import MainPanel from './components/MainPanel';
class App {
	private container: HTMLElement;
	constructor(contianer: HTMLElement) {
		this.container = contianer;
		this.container.appendChild(new Header().dom);
		this.container.appendChild(new MainPanel().dom);
	}
}

new App(document.getElementById('app') as HTMLElement);
