import Component from '../../../component';
import { CategoryApi, PaymentApi } from '../../../../api';
import ActionManager, {
	ADD_HISTORY_ACTION,
	AddHistoryData,
	EDIT_HISTORY_ACTION,
	START_EDIT_HISTORY_ACTION,
	EditHistoryData,
} from '../../../../utils/action-manager';
import { History } from '@shared/dto/history-dto';
import actionManager from '../../../../utils/action-manager';

class Editor extends Component {
	dom: HTMLElement;
	private serviceId: number;
	private paymentSelector: HTMLSelectElement;
	private incomeCategorySelector: HTMLSelectElement;
	private outcomeCategorySelector: HTMLSelectElement;
	private paymentMap = {};
	private categoryMap = {};

	// null if not editing, not null if editing
	private historyId: number | null = null;

	constructor() {
		super();
		this.dom = document.createElement('div');
		this.serviceId = 0;
		this.paymentSelector = document.createElement('select');
		this.incomeCategorySelector = document.createElement('select');
		this.outcomeCategorySelector = document.createElement('select');
		this.init();
	}

	async init() {
		this.initClassList();
		this.render();
		this.initHistoryDate();
		this.appendChilds();
		this.listener();
		this.fetchSelectorData();

		actionManager.subscribe({
			key: START_EDIT_HISTORY_ACTION,
			observer: (data: any) => {
				this.startEdit(data.history);
			},
		});
	}

	private initClassList() {
		this.dom.classList.add('editor');
		this.paymentSelector.classList.add('select-payment');
		this.incomeCategorySelector.classList.add('select-category');
		this.outcomeCategorySelector.classList.add('select-category');
	}

	private appendChilds() {
		const categorySection = this.dom.querySelector('.category-sector') as HTMLElement;
		const paymentSection = this.dom.querySelector('.payment-section') as HTMLElement;
		categorySection.appendChild(this.outcomeCategorySelector);
		paymentSection.appendChild(this.paymentSelector);
	}

	startEdit(h: History) {
		const selectCategory = this.dom.querySelector('.select-category') as HTMLSelectElement;
		const selectPayment = this.dom.querySelector('.select-payment') as HTMLSelectElement;

		this.historyId = h.id;
		//결제방식
		selectPayment.value = this.paymentMap[h.payment];
		//분류
		//TODO refactor
		const chkClassify = this.dom.querySelector('.chk-classify') as HTMLInputElement;
		chkClassify.checked = h.price > 0;
		const selector = this.dom.querySelector('.select-category') as HTMLSelectElement;
		const selectorParent = selector.parentElement as HTMLElement;
		if (chkClassify.checked) {
			chkClassify.checked = true;
			selector.remove();
			selectorParent.appendChild(this.incomeCategorySelector);
		} else if (!chkClassify.checked) {
			chkClassify.checked = false;
			selector.remove();
			selectorParent.appendChild(this.outcomeCategorySelector);
		}
		//카테고리
		selectCategory.value = this.categoryMap[h.category];
		//금액
		(this.dom.querySelector('.input-price') as any).value = Math.abs(h.price);
		//내용
		(this.dom.querySelector('.input-content') as any).value = h.content;

		//날짜
		const tt = (a: any) => {
			const str = '0' + a;
			return str.slice(str.length - 2, str.length);
		};
		(this.dom.querySelector('.input-date') as any).value = [
			h.historyDate.getFullYear() + '',
			tt(h.historyDate.getMonth() + 1),
			tt(h.historyDate.getDate()),
		].join('-');
		console.log(tt(h.historyDate.getMonth() + 1), tt(h.historyDate.getDate()));

		//버튼
		this.dom.querySelector('.confirm')!.innerHTML = '수정';
	}

	private render() {
		this.dom.innerHTML = `
		<div class="editor-row">
		    <div class="toggle-group">
		        <span class="item-title">분류</span>
		        <input type="checkbox" class="chk-classify">
		        <span class="toggle income">수입</span>
		        <span class="toggle outcome">지출</span>
		    </div>
		    <span class="clear-btn">내용 지우기</span>
		</div>
		<div class="editor-row">
		    <div class="child-input">
		        <span class="item-title">날짜</span>
		        <input type="date" class="input-date">
		    </div>
		    <div class="child-input category-sector">
		        <span class="item-title">카테고리</span>
		    </div>
		    <div class="child-input payment-section">
		        <span class="item-title">결제수단</span>
		    </div>
		</div>
		<div class="editor-row">
		    <div class="child-input">
		        <span class="item-title">금액</span>
		        <input type="number" class="input-price">
		    </div>
		    <div class="child-input">
		        <span class="item-title">내용</span>
		        <input type="text" class="input-content">
		    </div>
		</div>
		<div class="editor-row confirm-area">
		    <div class="confirm">
		        확인
		    </div>
		</div>
		`;
	}

	private listener() {
		const chkClassify = this.dom.querySelector('.chk-classify') as HTMLInputElement;
		const toggles = this.dom.querySelector('.toggle-group') as HTMLElement;
		const initFormBtn = this.dom.querySelector('.clear-btn') as HTMLElement;
		const confirmBtn = this.dom.querySelector('.confirm') as HTMLElement;
		const inputPrice = this.dom.querySelector('.input-price') as HTMLInputElement;

		toggles.addEventListener('click', (e: Event) => this.toggleClickHandler(e, chkClassify));
		initFormBtn.addEventListener('click', this.reload.bind(this));
		confirmBtn.addEventListener('click', () => this.confirmBtnClickHandler(chkClassify));
		/**
		 * TODO
		 * validation 체크 핸들러 부착
		 */
	}

	private async fetchSelectorData() {
		let payments = null;
		let categories = null;
		try {
			payments = await PaymentApi.findByServiceId(this.serviceId);
			categories = await CategoryApi.findByServiceId(this.serviceId);
		} catch (err) {
			throw err;
		}

		for (let i = 0; i < payments.length; i++) {
			const payment = document.createElement('option');
			payment.text = payments[i].name;
			payment.value = payments[i].id + '';
			this.paymentMap[payments[i].name] = payments[i].id;
			this.paymentMap[payments[i].id] = payments[i].name;
			this.paymentSelector.add(payment);
		}

		const incomeCategories = [];
		const outcomeCategories = [];

		categories.income.forEach((cat) => {
			const category = document.createElement('option');
			category.text = cat.name;
			category.value = cat.id + '';
			incomeCategories.push(category);
			this.categoryMap[cat.id] = cat.name;
			this.categoryMap[cat.name] = cat.id;
			this.incomeCategorySelector.add(category);
		});

		categories.outcome.forEach((cat) => {
			const category = document.createElement('option');
			category.text = cat.name;
			category.value = cat.id + '';
			this.categoryMap[cat.id] = cat.name;
			this.categoryMap[cat.name] = cat.id;
			this.incomeCategorySelector.add(category);
			outcomeCategories.push(category);
			this.outcomeCategorySelector.add(category);
		});
	}

	private initHistoryDate() {
		const inputDate = this.dom.querySelector('.input-date') as HTMLInputElement;
		inputDate.valueAsDate = new Date();
	}

	public reload() {
		this.render();
		this.initHistoryDate();
		this.appendChilds();
		this.listener();
		this.fetchSelectorData();
	}

	private toggleClickHandler(e: Event, chkClassify: HTMLInputElement) {
		const toggle = e.target as HTMLElement;
		const selector = this.dom.querySelector('.select-category') as HTMLSelectElement;
		const selectorParent = selector.parentElement as HTMLElement;

		if (toggle.classList.contains('income') && !chkClassify.checked) {
			chkClassify.checked = true;
			selector.remove();
			selectorParent.appendChild(this.incomeCategorySelector);
		} else if (toggle.classList.contains('outcome') && chkClassify.checked) {
			chkClassify.checked = false;
			selector.remove();
			selectorParent.appendChild(this.outcomeCategorySelector);
		}
	}

	private addHistory(chkClassify: HTMLInputElement) {
		const inputDate = this.dom.querySelector('.input-date') as HTMLInputElement;
		const selectCategory = this.dom.querySelector('.select-category') as HTMLSelectElement;
		const selectPayment = this.dom.querySelector('.select-payment') as HTMLSelectElement;
		const inputPrice = this.dom.querySelector('.input-price') as HTMLInputElement;
		const inputContent = this.dom.querySelector('.input-content') as HTMLInputElement;

		const data: AddHistoryData = {
			historyDate: inputDate.value,
			category: parseInt(selectCategory.value),
			payment: parseInt(selectPayment.value),
			price: chkClassify.checked ? parseInt(inputPrice.value) : -parseInt(inputPrice.value),
			content: inputContent.value,
		};

		ActionManager.notify({ key: ADD_HISTORY_ACTION, data: data });
		this.reload();
	}

	public setServiceId(serviceId: number) {
		this.serviceId = serviceId;
	}

	private editHistory(chkClassify: HTMLInputElement) {
		const inputDate = this.dom.querySelector('.input-date') as HTMLInputElement;
		const selectCategory = this.dom.querySelector('.select-category') as HTMLSelectElement;
		const selectPayment = this.dom.querySelector('.select-payment') as HTMLSelectElement;
		const inputPrice = this.dom.querySelector('.input-price') as HTMLInputElement;
		const inputContent = this.dom.querySelector('.input-content') as HTMLInputElement;

		const data: EditHistoryData = {
			id: this.historyId!,
			historyDate: inputDate.value,
			category: parseInt(selectCategory.value),
			payment: parseInt(selectPayment.value),
			price: chkClassify.checked ? parseInt(inputPrice.value) : -parseInt(inputPrice.value),
			content: inputContent.value,
		};

		ActionManager.notify({ key: EDIT_HISTORY_ACTION, data });
		this.reload();
	}

	private confirmBtnClickHandler(chkClassify: HTMLInputElement) {
		if (this.historyId === null) this.addHistory(chkClassify);
		else this.editHistory(chkClassify);
		this.historyId = null;
	}
}

export default Editor;
