export interface IComponent {
	dom: HTMLElement;
}

export interface Renderable {
	render: () => void;
}

export default class Header implements IComponent {
	dom: HTMLElement;
	constructor() {
		this.dom = document.createElement('header');
		this.dom.innerHTML = `
            <h1>가계부</h1>
            <button>결제 수단 관리</button>
        `;
	}

	render() {}
}
