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
		this.dom.classList.add('signup-page');
		this.render();
		this.listener();
	}

	listener() {
		const signinBtn = this.dom.querySelector('.signinBtn') as HTMLButtonElement;
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
		<span class="title-label signup-row">
			Sign Up With Email
		</span>

		<div class="signup-sector signup-row">
			<div class="">
				<span class="">
					이메일 ID
				</span>
			</div>
			<div class="">
				<input class="input-email" type="text" name="email" placeholder="hkb05@gmail.com" />
			</div>

			<div class="">
				<span class="">
					비밀번호
				</span>
			</div>
			<div class="">
				<input class="input-password" type="password" name="pw" placeholder="비밀번호(영문+숫자, 8~20자)" >
			</div>

			<div class="">
				<span class="">
					이름
				</span>
			</div>
			<div class="">
				<input class="input-username" type="text" name="username" placeholder="이름" >
			</div>

			<div class="">
				<button class="signinBtn">
					Sign Up
				</button>
			</div>			
		</div>
		`;
	}

	getDom() {
		return this.dom;
	}
}

export default SignupPage;
