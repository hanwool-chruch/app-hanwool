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

		let curAngle = 0;
		const svgString = this.data.map((item) => {
			const angle = getAngle(item.weight / weightSum);
			const startCoord = getCoordinate(curAngle);

			curAngle += angle;
			const finishCoord = getCoordinate(curAngle);

			return `<path d="M0 0 
                            L ${joinWithSpace(startCoord)} 
                            A 1 1, 0, ${angle > Math.PI ? '1' : '0'}, 1 
                            ${joinWithSpace(finishCoord)} 
                            Z" 
                    fill="${item.color}"></path>`;
		});

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

function joinWithSpace(numbers: number[]): string {
	return numbers.map((n) => n + '').join(' ');
}
