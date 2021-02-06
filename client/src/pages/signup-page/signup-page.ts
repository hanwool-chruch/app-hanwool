import Component from '../../components/component';
import HttpStatus from 'http-status';
import { UserApi } from '../../api';
import ActionManager, { LOGIN_ACTION } from '../../utils/action-manager';
import Router from '../../router';

class SignupPage extends Component {
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
		signinBtn.addEventListener('click', this.signinBtnClickHandler.bind(this));
	}

	async signinBtnClickHandler() {
		const emailInput = this.dom.querySelector('.input-email') as HTMLInputElement;
		const passwordInput = this.dom.querySelector('.input-password') as HTMLInputElement;
		const nameInput = this.dom.querySelector('.input-username') as HTMLInputElement;

		try {
			const body = {
				email: emailInput.value,
				password: passwordInput.value,
				name: nameInput.value,
				image: null,
			};
			const response = await UserApi.emailSignUp(body);
			if (response.status === HttpStatus.CREATED) {
				const data = await response.json();
				const serviceId = data.result.user.service_id;
				const userId = data.result.user.user_id;
				console.info(data.message);
				ActionManager.notify({ key: LOGIN_ACTION, data: { serviceId, userId } });
			} else {
				console.error('no status CREATED', response.status);
			}
		} catch (err) {
			throw new Error(`fail to create email user (${emailInput.value}): ${err.stack}`);
		}
	}

	render() {
		this.dom.innerHTML = `


		<form>
		<div class="container">
			<span class="title-label">
				한울 청년부 회원가입
			</span>
			<div class="form-group">
				<label for="input-email">Email</label>
				<input id="input-email" class="form-control" type="email" name="email"  placeholder="a123@naver.com" />
			</div>
			<div class="form-group">
				<label for="input-email">Password</label>
				<input id="input-password" class="form-control" type="password" name="pw" aria-describedby="passwordHelp" />
				<small id="passwordHelp" class="form-text text-muted">비밀번호(영문+숫자, 8~20자)</small>
			</div>
			<div class="form-group">
				<label for="input-username">Name</label>
				<input id="input-username" class="form-control" type="text" name="username" placeholder="이름" />
			</div>
			<button id="signinBtn" class="large-button">회원가입</button>			
		</div>	
		</form>
		`;
	}

	getDom() {
		return this.dom;
	}
}

export default SignupPage;
