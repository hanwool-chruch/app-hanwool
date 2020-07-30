import Component from '../../../component';

export default class Editor extends Component {
	dom: HTMLElement;
	constructor() {
		super();
		this.dom = document.createElement('div');
		this.init();
	}

	init() {
		this.dom.classList.add('editor');
		this.render();
		this.listener();
	}

	render() {
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
            <div class="child-input">
                <span class="item-title">카테고리</span>
                <select class="select-category">
                    <option>쇼핑/뷰티</option>
                    <option>식비</option>
                    <option>월급</option>
                    <option>생활</option>
                    <option>카페/간식</option>
                    <option>문화/여가</option>
                </select>
            </div>
            <div class="child-input">
                <span class="item-title">결제수단</span>
                <select class="select-payment">
                    <option>현금</option>
                    <option>신한카드</option>
                    <option>국민카드</option>                    
                </select>
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

	listener() {
		const chkClassify = this.dom.querySelector('.chk-classify') as HTMLInputElement;
		const toggles = this.dom.querySelector('.toggle-group') as HTMLElement;
		const initFormBtn = this.dom.querySelector('.clear-btn') as HTMLElement;
		const confirmBtn = this.dom.querySelector('.confirm') as HTMLElement;

		toggles.addEventListener('click', (e: Event) => this.toggleClickHandler(e, chkClassify));
		initFormBtn.addEventListener('click', this.reload);
		confirmBtn.addEventListener('click', () => this.confirmBtnClickHandler(chkClassify));
		/**
		 * TODO
		 * validation 체크 핸들러 부착
		 */
	}

	reload() {
		this.render();
		this.listener();
	}

	toggleClickHandler(e: Event, chkClassify: HTMLInputElement) {
		const toggle = e.target as HTMLElement;
		if (toggle.classList.contains('income')) {
			chkClassify.checked = true;
		} else {
			chkClassify.checked = false;
		}
	}

	confirmBtnClickHandler(chkClassify: HTMLInputElement) {
		const inputDate = this.dom.querySelector('.input-date') as HTMLInputElement;
		const selectCategory = this.dom.querySelector('.select-category') as HTMLSelectElement;
		const selectPayment = this.dom.querySelector('.select-payment') as HTMLSelectElement;
		const inputPrice = this.dom.querySelector('.input-price') as HTMLInputElement;
		const inputContent = this.dom.querySelector('.input-content') as HTMLInputElement;

		const data = {
			user_id: 1,
			service_id: 1,
			historyDate: inputDate.value,
			category: selectCategory.value,
			payment: selectPayment.value,
			price: chkClassify.checked ? inputPrice.value : ~inputPrice.value,
			content: inputContent.value,
		};

		this.storeHistory(data);
		this.reload();
	}

	/**
	 * TODO
	 * 아이템 모델에 등록 구현
	 */
	storeHistory(data: any) {
		alert(JSON.stringify(data));
	}
}
