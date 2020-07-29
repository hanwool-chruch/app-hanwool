export type History = {
	id: number;
	price: number;
	content: string;
	historyDate: Date;
	category: string;
	payment: string;
};

export interface IContent {
	load(histories: History[]): void;
}
