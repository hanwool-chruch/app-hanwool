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
		const accountingBtn = this.dom.querySelector('#accountingBtn') as HTMLButtonElement;
		const qrLoginBtn = this.dom.querySelector('#qrLoginBtn') as HTMLButtonElement;

		accountingBtn.addEventListener('click', () => {
			Router.notify({
				key: 'loadHistory',
				data: {
					serviceId: 23000,
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
		  <div class="container">
		  	<div class="title-label">
				Main Page
		    </div>
			<div class="row">
				<div class="card">
				  <div class="card-body">
					<button id="qrLoginBtn" class="large-button"><img src="https://img.icons8.com/ios-glyphs/60/000000/qr-code--v2.png" alt="QR-LOGIN"> QR Login </button>
					<button id="accountingBtn" class="large-button"><img src="https://img.icons8.com/ios-glyphs/60/000000/calculator.png" alt="회계관리"> 회계 관리 </button>
				  </div>
				</div>
			</div>
		  </div>
		`;
	}
}

export default MainPage;
