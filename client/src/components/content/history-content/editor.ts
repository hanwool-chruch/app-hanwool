import Component from '../../component';

export default class Editor extends Component {
	constructor() {
		super();
		this.dom = document.createElement('div');
		this.dom.innerHTML = `
        <div>
            <span>분류</span> <button>수입</button><button>지출</button> <button>내용 지우기</button>
        </div>
        <div>
            <span>날짜</span> <input type="date" /> 
            <span>카테고리</span> 
                <select>
                    <option>밥</option>
                    <option>술</option>
                    <option>다이소</option>
                    <option>콩</option>
                </select>
            <span>결제수단</span>
                <select>
                    <option>돈</option>
                    <option>카드</option>
                    <option>외상</option>
                </select>
        </div>
        <div>
            <span>금액</span> <input type="number" /> 
            <span>내용</span> <input /> 
        </div>
        <div>
            <button>확인</button>
        </div>
        `;
	}
}
