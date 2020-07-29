import Component from '../component';

export type History = {
	id: number;
	price: number;
	content: string;
	historyDate: Date;
	category: string;
	payment: string;
};

export abstract class AbstractContent extends Component {
	// 새로운 기록을 받아서 렌더/업데이트
	abstract load(histories: History[]): void;
}
