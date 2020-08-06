import Component from '../component';
import Router from '../../router';
import { deleteCookie } from '../../utils/cookie-manager';

export default class Header extends Component {
	dom: HTMLElement;
	constructor() {
		super();
		this.dom = document.createElement('header');
		this.dom.classList.add('global-header');
		this.init();
	}

	init() {
		this.render();
		this.listener();
	}

	render() {
		this.dom.innerHTML = `
			<h1>가계부</h1>
			<div>
				<span class="logout-btn">로그아웃</span>
				<span class="open-payment-btn">결제 수단 관리</span>
			</div>
		`;
	}

	listener() {
		const logoutBtn = this.dom.querySelector('.logout-btn') as HTMLSpanElement;
		const openPaymentBtn = this.dom.querySelector('.open-payment-btn') as HTMLSpanElement;
		logoutBtn.addEventListener('click', (e: Event) => {
			deleteCookie('authorization');
			Router.notify({ key: 'loadPage', data: { pageName: 'login' } });
		});
	}
}
