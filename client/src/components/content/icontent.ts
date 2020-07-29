export type History = {
	id: number;
	price: number;
	content: string;
	historyDate: Date;
	category: string;
	payment: string;
};

export interface IContent {
	// 새로운 기록을 받아서 렌더/업데이트
	load(histories: History[]): void;
}
