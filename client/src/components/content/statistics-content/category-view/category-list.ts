import { AbstractContent } from '../../abstract-content';
import { History } from '@shared/dto/history-dto';
import PieChart, { ChartItem } from './pie-chart';

/**
 * 통계 창의 일별 통계의 카테고리별 막대 차트
 */
export default class CategoryList extends AbstractContent {
	dom: HTMLElement;

	constructor() {
		super();
		this.dom = document.createElement('div');
		this.init();
	}

	init() {
		this.dom.classList.add('category-stat-view-list');
		this.dom.innerHTML = ``;
	}

	private render(histories: History[]) {
		console.log(sumByCategory(histories));
	}

	/**
	 *
	 * @param histories {History[]} - should have at leat one item to render calendar
	 */
	load(histories: History[]): void {
		this.render(histories);
	}
}

function sumByCategory(histories: History[]): { name: string; price: number; ratio: number }[] {
	//TODO refactor
	let total = 0;
	const sumByCat = histories.reduce((acc, h) => {
		if (h.price > 0) return acc;
		if (!acc[h.category]) acc[h.category] = 0;
		acc[h.category] -= h.price;
		total -= h.price;
		return acc;
	}, {});

	return Object.keys(sumByCat)
		.reduce((acc: any, k) => {
			return [...acc, [sumByCat[k], k]];
		}, [])
		.sort()
		.map(([price, name]: [number, string]) => {
			return {
				ratio: price / total,
				name,
				price,
			};
		});
}

function getRandomColor() {
	return Math.floor(Math.random() * 16777215).toString(16);
}
