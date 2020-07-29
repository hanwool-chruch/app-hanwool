import Component from '../component';

export default class Header extends Component {
	dom: HTMLElement;
	constructor() {
		super();
		this.dom = document.createElement('header');
		this.init();
	}

	init() {
		this.render();
		this.listener();
	}

	render() {
		this.dom.innerHTML = `
            <h1>가계부</h1>
            <button>결제 수단 관리</button>
		`;
	}

	listener() {}
}
