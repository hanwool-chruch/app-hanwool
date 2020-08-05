import { AbstractContent } from '../../abstract-content';
import { History } from '@shared/dto/history-dto';
import PieChart, { ChartItem } from './pie-chart';
import CategoryList from './category-list';

export default class CategoryView extends AbstractContent {
	dom: HTMLElement;
	list: AbstractContent | null = null;

	constructor() {
		super();
		this.dom = document.createElement('div');
		this.init();
	}

	init() {
		this.dom.classList.add('category-stat-view');
		this.dom.innerHTML = ``;
	}

	private render(histories: History[]) {
		this.dom.innerHTML = '';
		this.dom.appendChild(new PieChart(formatChartItem(histories)).getDom());
		const list = new CategoryList();
		list.load(histories);
		this.dom.appendChild(list.getDom());
	}

	/**
	 *
	 * @param histories {History[]} - should have at leat one item to render calendar
	 */
	load(histories: History[]): void {
		this.render(histories);
	}
}

function formatChartItem(histories: History[]): ChartItem[] {
	//TODO refactor
	const sumByCat = histories.reduce((acc, h) => {
		if (h.price > 0) return acc;
		if (!acc[h.category]) acc[h.category] = 0;
		acc[h.category] -= h.price;
		return acc;
	}, {});

	const priceCategory = Object.keys(sumByCat)
		.reduce((acc: any, k) => {
			return [...acc, [sumByCat[k], k]];
		}, [])
		.sort() as [number, string][];

	const topFive = priceCategory.slice(0, 5);
	const topFiveCat = topFive.map(([_, name]) => name);
	const restPrice = priceCategory.reduce((acc, [price, name]) => {
		if (topFiveCat.includes(name)) return acc;
		else return acc + price;
	}, 0);

	const result = [
		...topFive.map(([price, name]) => {
			return { name, weight: price, color: '#' + getRandomColor() };
		}),
	];
	if (restPrice !== 0) {
		result.push({ name: '나머지', weight: restPrice, color: '#' + getRandomColor() });
	}
	return result;
}

function getRandomColor() {
	return Math.floor(Math.random() * 16777215).toString(16);
}
