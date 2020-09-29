import Component from '../component';
import Router from '../../router';
import actionManager, {
	DISABLE_BULK_CATEGORY,
	DISABLE_BULK_PAYMENT,
	RELOAD_HISTORY_ACTION,
} from '../../utils/action-manager';
import { deleteCookie } from '../../utils/cookie-manager';
import { BulkApi, PaymentApi, CategoryApi } from '../../api';

interface BULK_RESPONSE {
	insertId: number;
	affectedRows: number;
}

const [PAYMENT_INDEX, CATEGORY_INDEX, HISTORY_INDEX] = [0, 1, 2];
export default class Header extends Component {
	dom: HTMLElement;
	private serviceId: number;
	private disalbedButtons: Array<Boolean>;
	private categories?: BULK_RESPONSE;
	private payments?: BULK_RESPONSE;

	constructor() {
		super();
		this.serviceId = 0;
		this.disalbedButtons = new Array(3).fill(false);
		this.disalbedButtons[HISTORY_INDEX] = true;
		this.dom = document.createElement('header');
		this.dom.classList.add('global-header');
		this.init();
	}

	init() {
		this.render();
		this.listener();
		this.initBulkReq();
		this.initEventManager();
	}

	render() {
		this.dom.innerHTML = `
			<div class="bulk-sector">
				<span class='bulk-insert payment-bulk ${
					this.disalbedButtons[PAYMENT_INDEX] ? 'disabled' : ''
				}'>결제방식 자동 추가</span>
				<span class='bulk-insert category-bulk ${
					this.disalbedButtons[CATEGORY_INDEX] ? 'disabled' : ''
				}'>카테고리 자동 추가</span>
				<span class='bulk-insert history-bulk ${
					this.disalbedButtons[HISTORY_INDEX] ? 'disabled' : ''
				}'>내역 자동 추가</span>
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
			this.payments = (await response.json()).result;
			paymentBulk.classList.add('disabled');
			if (categoryBulk.classList.contains('disabled')) {
				historyBulk.classList.remove('disabled');
			}
			Router.notify({ key: 'loadView', data: { viewName: 'history', serviceId: this.serviceId } });
		});

		categoryBulk.addEventListener('click', async () => {
			let data = this.initCategoryData();
			const response = await BulkApi.bulkInsertCategory(data);
			this.categories = (await response.json()).result;
			categoryBulk.classList.add('disabled');
			if (paymentBulk.classList.contains('disabled')) {
				historyBulk.classList.remove('disabled');
			}
			Router.notify({ key: 'loadView', data: { viewName: 'history', serviceId: this.serviceId } });
		});

		historyBulk.addEventListener('click', async () => {
			let data = this.initHistoryData();
			await BulkApi.bulkInsertHistory(data);
			actionManager.notify({ key: RELOAD_HISTORY_ACTION, data: {} });
		});
	}

	private async initBulkReq() {
		if (this.serviceId !== 0) {
			const payments = await PaymentApi.findByServiceId(this.serviceId);
			const categories = await CategoryApi.findByServiceId(this.serviceId);
			this.payments = { affectedRows: payments.length, insertId: payments[0].id };
			this.categories = {
				affectedRows: categories.income.length + categories.outcome.length,
				insertId: categories.outcome.sort((a, b) => a.id - b.id)[0].id,
			};
		}
	}

	private initEventManager() {
		Router.subscribe({
			key: 'publishServiceId',
			observer: (data) => {
				this.setServiceId(data.serviceId);
				this.init();
			},
		});

		actionManager.subscribe({
			key: DISABLE_BULK_CATEGORY,
			observer: () => {
				this.setDisalbedButtons(CATEGORY_INDEX, true);
				if (this.disalbedButtons[PAYMENT_INDEX]) this.setDisalbedButtons(HISTORY_INDEX, false);
				this.init();
			},
		});

		actionManager.subscribe({
			key: DISABLE_BULK_PAYMENT,
			observer: () => {
				this.setDisalbedButtons(PAYMENT_INDEX, true);
				if (this.disalbedButtons[CATEGORY_INDEX]) this.setDisalbedButtons(HISTORY_INDEX, false);
				this.init();
			},
		});
	}

	initPaymentData(): BulkApi.bulkPayment {
		return {
			data: [
				['현금', this.serviceId],
				['신용카드', this.serviceId],
				['체크카드', this.serviceId],
				['배민페이', this.serviceId],
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
		const date = new Date();
		const days = [
			`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
			`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() - 1}`,
			`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() - 2}`,
			`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
		];

		const genRandomNum = (min: number, max: number) => {
			return Math.floor(Math.random() * (max - min) + min);
		};

		const genOutcomeCategoryId = genRandomNum.bind(
			null,
			this.categories!.insertId,
			this.categories!.insertId + this.categories!.affectedRows / 2
		);

		const genIncomeCategoryId = genRandomNum.bind(
			null,
			this.categories!.insertId + this.categories!.affectedRows / 2,
			this.categories!.insertId + this.categories!.affectedRows
		);

		const genPaymentId = genRandomNum.bind(
			null,
			this.payments!.insertId,
			this.payments!.insertId + this.payments!.affectedRows
		);

		return {
			data: [
				[-10700, '1인 보쌈 XL', days[0], genOutcomeCategoryId(), genPaymentId(), this.serviceId],
				[-3000, '라임 킥보드', days[0], genOutcomeCategoryId(), genPaymentId(), this.serviceId],
				[
					100000,
					`${date.getMonth() + 1}}월 월급`,
					days[0],
					genIncomeCategoryId(),
					genPaymentId(),
					this.serviceId,
				],
				[-20000, '로봇 청소기', days[0], genOutcomeCategoryId(), genPaymentId(), this.serviceId],
				[-15000, '청바지', days[0], genOutcomeCategoryId(), genPaymentId(), this.serviceId],
				[-20000, '이어폰', days[1], genOutcomeCategoryId(), genPaymentId(), this.serviceId],
				[-10000, '축의금', days[1], genOutcomeCategoryId(), genPaymentId(), this.serviceId],
				[30000, '빌려준 돈 받음', days[2], genIncomeCategoryId(), genPaymentId(), this.serviceId],
				[-5000, 'PC방 3시간', days[2], genOutcomeCategoryId(), genPaymentId(), this.serviceId],
				[-25000, '와인 한잔', days[3], genOutcomeCategoryId(), genPaymentId(), this.serviceId],
				[-4500, '카페라때', days[3], genOutcomeCategoryId(), genPaymentId(), this.serviceId],
				[100000, '용돈', days[3], genIncomeCategoryId(), genPaymentId(), this.serviceId],
				[-35000, '흰 셔츠', days[3], genOutcomeCategoryId(), genPaymentId(), this.serviceId],
				[
					-20000,
					'BHC 뿌링클 + 콜라 1.25L',
					days[3],
					genOutcomeCategoryId(),
					genPaymentId(),
					this.serviceId,
				],
			],
		};
	}

	setServiceId(serviceId: number) {
		this.serviceId = serviceId;
	}
	setDisalbedButtons(index: number, value: Boolean) {
		this.disalbedButtons[index] = value;
	}
}
