import Component from '../../components/component';
import HttpStatus from 'http-status';
import { UserApi } from '../../api';
import ActionManager, { LOGIN_ACTION } from '../../utils/action-manager';
import Router from '../../router';

class LoginPage extends Component {
	dom: HTMLElement;
	constructor() {
		super();
		this.dom = document.createElement('div');
		this.init();
	}

	init() {
		this.dom.classList.add('app-page');
		this.render();
		this.listener();
	}

	listener() {
		const signinBtn = this.dom.querySelector('#signinBtn') as HTMLButtonElement;
		const signupBtn = this.dom.querySelector('#signupBtn') as HTMLSpanElement;
		const googleBtn = this.dom.querySelector('#googleBtn') as HTMLSpanElement;

		signinBtn.addEventListener('click', this.signingBtnClickHandler.bind(this));
		signupBtn.addEventListener('click', () =>
			Router.notify({ key: 'loadPage', data: { pageName: 'signup' } })
		);

		googleBtn.addEventListener('click', () => {
			location.href = '/api/auth/google';
		});
	}

	// @ts-ignore
	async signingBtnClickHandler() {
		const emailInput = this.dom.querySelector('.input-email') as HTMLInputElement;
		const passwordInput = this.dom.querySelector('.input-password') as HTMLInputElement;

		let response;
		try {
			response = await UserApi.emailLogin({
				email: emailInput.value,
				password: passwordInput.value,
			});
		} catch (err) {
			throw new Error(`fail to login email user (${emailInput.value}): ${err.stack}`);
		}
		if (response.status === HttpStatus.OK || response.status === HttpStatus.NOT_MODIFIED) {
			const data = await response.json();
			console.info(data);
			const serviceId = data.result.serviceId;
			const userId = data.result.userId;
			ActionManager.notify({ key: LOGIN_ACTION, data: { serviceId, userId } });

		} else {
			console.error(`not match user`, response.status);
		}
	}

	render() {
		this.dom.innerHTML = `
		<span class="title-label">
			한울 청년부 로그인
		</span>			
		<div class="container">		
			<div class="form-group">
				<label for="input-email">이메일</label>
				<input id="input-email" class="input-email form-control" type="text" name="email" placeholder="A123@gmail.com" />
			</div>

			<div class="form-group">
				<label for="input-password">비밀번호</label>
				<input id="input-password" class="input-password form-control" type="password" name="pw" placeholder="비밀번호(영문+숫자, 8~20자)" >
			</div>	
		</div>
		<div class="sector">
			<button id="googleBtn" class="large-button"><img src="/images/icon-google.png" alt="GOOGLE"> Google </button>
			<button id="signinBtn" class="large-button">로그인</button>								
			<button id="signupBtn" class="large-button">회원가입</button>				
		</div>		
		`;
	}

	getDom() {
		return this.dom;
	}
}

export default LoginPage;
