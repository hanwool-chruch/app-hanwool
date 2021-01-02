import Component from '../../components/component';
import HttpStatus from 'http-status';
import { UserApi } from '../../api';
import ActionManager, { LOGIN_ACTION } from '../../utils/action-manager';
import Router from '../../router';

class MainPage extends Component {
	dom: HTMLElement;
	constructor() {
		super();
		this.dom = document.createElement('div');
		this.init();
	}

	init() {
		this.dom.classList.add('main-page');
		this.render();
		this.listener();
	}

	listener() {
		const calculatorBtn = this.dom.querySelector('#calculatorBtn') as HTMLSpanElement;
		const qrLoginBtn = this.dom.querySelector('#qrLoginBtn') as HTMLSpanElement;

		calculatorBtn.addEventListener('click', () => {
			Router.notify({
				key: 'loadHistory',
				data: {
					serviceId: 1,
					year: 2020,
					month: 1,
				},
			});
		});

		qrLoginBtn.addEventListener('click', () => {
			Router.notify({ key: 'loadPage', data: { pageName: 'qr' } });
		});
	}

	// @ts-ignore
	async signingBtnClickHandler() {

	}

	getDom() {
		return this.dom;
	}

	render() {
		this.dom.innerHTML = `
			<span class="title-label login-row">
				Main Page
			</span>
			
			<div class="social-sector login-row">
				<span id="calculatorBtn" class="socialBtn">
					<img src="https://img.icons8.com/ios-glyphs/60/000000/calculator.png"/>
					<span>계산기</span>
				</span>
				<span id="qrLoginBtn" class="socialBtn">
					<img src="https://img.icons8.com/ios-glyphs/60/000000/qr-code--v2.png"/>
					<span>QR Login</span>
				</span>
			</div>
		`;
	}
}

export default MainPage;
