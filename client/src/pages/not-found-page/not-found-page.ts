import Component from '../../components/component';

class NotFoundPage extends Component {
	dom: HTMLElement;
	constructor() {
		super();
		this.dom = document.createElement('div');
		this.init();
	}

	init() {
		this.render();
	}

	render() {
		this.dom.innerHTML = `<h1>Not Found Page</h1>`;
	}

	getDom() {
		return this.dom;
	}
}

export default NotFoundPage;
