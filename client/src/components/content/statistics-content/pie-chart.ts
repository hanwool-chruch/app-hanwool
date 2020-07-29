import Component from '../../component';

type ChartItem = {
	name: string;
	weight: number;
	color: string;
};
export default class PieChart extends Component {
	private data: ChartItem[] = [];
	constructor(data: ChartItem[]) {
		super();
		this.dom = document.createElement('div');
		this.data = data;
		this.init();
	}

	init(): void {
		this.render();
	}

	private render() {
		const weightSum = this.data.reduce((acc, { weight }) => acc + weight, 0);
		const svgString = this.data.reduce(
			([acc, curAngle]: [string, number], item): any => {
				const angle = getAngle(item.weight / weightSum);
				const startCoord = getCoordinate(curAngle);
				const finishCoord = getCoordinate(curAngle + angle);

				return [
					acc +
						`<path d="M0 0 L ${startCoord.map((n) => n + '').join(' ')} A 1 1, 0, ${
							angle > Math.PI ? '1, 1' : '0, 1'
						}, ${finishCoord.map((n) => n + '').join(' ')} Z" fill="${item.color}"></path>`,
					curAngle + angle,
				];
			},
			['', 0]
		)[0];

		this.dom!.innerHTML =
			'<svg width="500" height="500" viewBox="-1.5 -1.5 3 3">' + svgString + '</svg>';
	}
}

function getAngle(proportion: number): number {
	return 2 * Math.PI * proportion;
}

function getCoordinate(angle: number): [number, number] {
	let x = Math.sin(angle);
	x = Math.round(x * 1000) / 1000;
	let y = -Math.cos(angle);
	y = Math.round(y * 1000) / 1000;

	return [x, y];
}
