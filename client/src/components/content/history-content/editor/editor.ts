import Component from '../../../component';
import { CategoryApi, PaymentApi } from '../../../../api';
import { PaymentDto, CategoryDto } from '@shared/dto';
import ActionManager from '../../../../utils/action-manager';

interface HistoryDataType {
	user_id: number;
	service_id: number;
	historyDate: string;
	category: number;
	payment: number;
	price: number;
	content: string;
}

class Editor extends Component {
	dom: HTMLElement;
	private paymentSelector: HTMLSelectElement;
	private incomeCategorySelector: HTMLSelectElement;
	private outcomeCategorySelector: HTMLSelectElement;

	constructor() {
		super();
		this.dom = document.createElement('div');
		this.paymentSelector = document.createElement('select');
		this.incomeCategorySelector = document.createElement('select');
		this.outcomeCategorySelector = document.createElement('select');
		this.init();
	}

	async init() {
		this.initClassList();
		await this.fetchSelectorData();
		this.render();
		this.initHistoryDate();
		this.appendChilds();
		this.listener();
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
		const service_id = 1;
		const paymentDto: PaymentDto.GET_DATA = { service_id };
		const categoryDto: CategoryDto.GET_DATA = { service_id };
		try {
			const paymentRes = await PaymentApi.findAll(paymentDto);
			const payments = (await paymentRes.json()).result;

			for (let i = 0; i < payments.length; i++) {
				const payment = document.createElement('option');
				payment.text = payments[i].payment_name;
				payment.value = payments[i].payment_id;
				this.paymentSelector.add(payment);
			}

			const categoryRes = await CategoryApi.findAll(categoryDto);
			const categories = (await categoryRes.json()).result;
			const incomeCategories = [];
			const outcomeCategories = [];
			for (let i = 0; i < categories.length; i++) {
				const category = document.createElement('option');
				category.text = categories[i].category_name;
				category.value = categories[i].category_id;
				if (categories[i].for_income) {
					incomeCategories.push(categories[i]);
					this.incomeCategorySelector.add(category);
				} else {
					outcomeCategories.push(categories[i]);
					this.outcomeCategorySelector.add(category);
				}
			}
		} catch (err) {
			throw err;
		}
	}

	private initHistoryDate() {
		const inputDate = this.dom.querySelector('.input-date') as HTMLInputElement;
		inputDate.valueAsDate = new Date();
	}

	private reload() {
		this.render();
		this.initHistoryDate();
		this.appendChilds();
		this.listener();
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

	private confirmBtnClickHandler(chkClassify: HTMLInputElement) {
		const inputDate = this.dom.querySelector('.input-date') as HTMLInputElement;
		const selectCategory = this.dom.querySelector('.select-category') as HTMLSelectElement;
		const selectPayment = this.dom.querySelector('.select-payment') as HTMLSelectElement;
		const inputPrice = this.dom.querySelector('.input-price') as HTMLInputElement;
		const inputContent = this.dom.querySelector('.input-content') as HTMLInputElement;

		const data: HistoryDataType = {
			user_id: 1,
			service_id: 1,
			historyDate: inputDate.value,
			category: parseInt(selectCategory.value),
			payment: parseInt(selectPayment.value),
			price: chkClassify.checked ? parseInt(inputPrice.value) : ~inputPrice.value,
			content: inputContent.value,
		};

		ActionManager.notify({ key: 'addHistory', data: data });
		this.reload();
	}
}

export { HistoryDataType };
export default Editor;
