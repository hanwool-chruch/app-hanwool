import Component from '../component';
import Router from '../../router';
import { deleteCookie } from '../../utils/cookie-manager';
import { BulkApi } from '../../api';

interface BULK_RESPONSE {
	insertedId: number;
	affectedRows: number;
}
export default class Header extends Component {
	dom: HTMLElement;
	private serviceId: number;
	private categories?: BULK_RESPONSE;
	private payments?: BULK_RESPONSE;

	constructor() {
		super();
		this.serviceId = 0;
		this.dom = document.createElement('header');
		this.dom.classList.add('global-header');
		this.init();
	}

	init() {
		this.render();
		this.listener();
		this.initEventManager();
	}

	render() {
		this.dom.innerHTML = `
			<div class="bulk-sector">
				<span class='bulk-insert payment-bulk disabled'>결제방식 자동 추가</span>
				<span class='bulk-insert category-bulk disabled'>카테고리 자동 추가</span>
				<span class='bulk-insert history-bulk disabled'>내역 자동 추가</span>
			</div>
			<h1 class="title-sector">
				가계부
			</h1>
			<div class="button-sector">
				<span class="logout-btn">로그아웃</span>
				<span class="open-payment-btn">결제 수단 관리</span>
			</div>
		`;
	}

	listener() {
		const logoutBtn = this.dom.querySelector('.logout-btn') as HTMLSpanElement;
		const openPaymentBtn = this.dom.querySelector('.open-payment-btn') as HTMLSpanElement;
		const paymentBulk = this.dom.querySelector('.payment-bulk') as HTMLSpanElement;
		const categoryBulk = this.dom.querySelector('.category-bulk') as HTMLSpanElement;
		const historyBulk = this.dom.querySelector('.history-bulk') as HTMLSpanElement;

		logoutBtn.addEventListener('click', (e: Event) => {
			deleteCookie('authorization');
			Router.notify({ key: 'loadPage', data: { pageName: 'login' } });
		});

		paymentBulk.addEventListener('click', async () => {
			let data = this.initPaymentData();
			const response = await BulkApi.bulkInsertPayment(data);
			this.payments = await response.json();
			paymentBulk.classList.add('disabled');
			if (categoryBulk.classList.contains('disabled')) {
				historyBulk.classList.remove('disabled');
			}
			Router.notify({ key: 'loadView', data: { viewName: 'history', serviceId: this.serviceId } });
		});

		categoryBulk.addEventListener('click', async () => {
			let data = this.initCategoryData();
			const response = await BulkApi.bulkInsertCategory(data);
			this.categories = await response.json();
			categoryBulk.classList.add('disabled');
			if (paymentBulk.classList.contains('disabled')) {
				historyBulk.classList.remove('disabled');
			}
			Router.notify({ key: 'loadView', data: { viewName: 'history', serviceId: this.serviceId } });
		});

		historyBulk.addEventListener('click', () => {
			let data = this.initHistoryData();
			BulkApi.bulkInsertHistory(data);
			historyBulk.classList.add('disabled');
		});
	}

	private initEventManager() {
		Router.subscribe({
			key: 'publishServiceId',
			observer: (data) => {
				this.setServiceId(data.serviceId);
				this.render();
				this.listener();
			},
		});
	}

	initPaymentData(): BulkApi.bulkPayment {
		return {
			data: [
				['배민페이', this.serviceId],
				['현금', this.serviceId],
				['신한카드', this.serviceId],
				['카카오페이', this.serviceId],
				['토스', this.serviceId],
			],
		};
	}

	initCategoryData(): BulkApi.bulkCategory {
		return {
			data: [
				['쇼핑/뷰티', this.serviceId, 0],
				['교통', this.serviceId, 0],
				['생활', this.serviceId, 0],
				['의료/건강', this.serviceId, 0],
				['문화/여가', this.serviceId, 0],
				['미분류', this.serviceId, 0],
				['월급', this.serviceId, 1],
				['용돈', this.serviceId, 1],
				['보너스', this.serviceId, 1],
				['환불', this.serviceId, 1],
				['더치페이', this.serviceId, 1],
				['미분류', this.serviceId, 1],
			],
		};
	}

	initHistoryData(): BulkApi.bulkHistory {
		const now = new Date();

		this.categories;
		this.payments;

		return {
			data: [
				[10700, '1인 보쌈 XL', now, 16, 14, this.serviceId],
				[3000, '라임 킥보드', now, 15, 13, this.serviceId],
				[100000, '7월 월급', now, 20, 12, this.serviceId],
				[20000, '로봇 청소기', now, 14, 15, this.serviceId],
				[15000, '청바지', now, 14, 13, this.serviceId],
			],
		};
	}

	setServiceId(serviceId: number) {
		this.serviceId = serviceId;
	}
}
