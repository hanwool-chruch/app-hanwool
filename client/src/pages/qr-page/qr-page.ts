import Component from '../../components/component';
// @ts-ignore
import QRCode from 'exports-loader?QRCode!qrcodejs/qrcode'
import Router from '../../router';
import HistoryModel from "../../models/history-model";
import HistoryContent from "../../components/content/history-content";

class QRPage extends Component {
	dom: HTMLElement;
	constructor() {
		super();
		this.dom = document.createElement('div');
		this.init();
	}

	init() {
		this.dom.classList.add('qr-page');
		this.render();
		this.listener();
	}

	listener() {
		this.initEventManager()
	}

	initEventManager() {
		Router.subscribe({
			key: 'loadView-qr',
			observer: (data) => this.changeView(data.viewName, data.userId),
		});
	}

	changeView(viewName: string, userId: number) {
		this.load_code(userId)
	}

	load_code(userId:number) {
		const divCode = this.dom.querySelector('.code') as HTMLDivElement;
		divCode.innerHTML = "";
		new QRCode(divCode, {
			text: JSON.stringify({
				userId: userId,
				date: new Date()
			}),
			width: "300",
			height: "300",
			colorDark : "#000000",
			colorLight : "#ffffff",
			correctLevel : QRCode.CorrectLevel.H
		})
	}

	render() {
		this.dom.innerHTML = `
		<span class="title-label login-row">
			한울 청년부 환영합니다
		</span>
		<div class="login-sector login-row">
		  <div class="container">
			<div class="row">
			  <div class="col-lg-6 offset-lg-3 col-md-12 mb-4">
				<div class="card">
				  <div class="card-body">
					<div id="code" class="code"></div>
				  </div>
				</div>
			  </div>
			</div>
		  </div>
		</div>
		`;
	}

	getDom() {
		return this.dom;
	}
}

export default QRPage;
