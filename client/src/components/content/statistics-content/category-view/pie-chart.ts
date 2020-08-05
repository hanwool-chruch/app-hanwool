import Component from '../../../component';

export type ChartItem = {
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
		if (this.data.length === 0) return;

		let svgString = '';
		if (this.data.length === 1) {
			svgString = `<circle cx="0" cy="0" r="1" fill="${this.data[0].color}"/>
			${createLabel(Math.PI, this.data[0].name)}
			`;
		} else {
			const weightSum = this.data.reduce((acc, { weight }) => acc + weight, 0);

			let curAngle = 0;
			svgString = this.data
				.map((item) => {
					const angle = getAngle(item.weight / weightSum);
					const startCoord = getCoordinate(curAngle);
					const finishCoord = getCoordinate(curAngle + angle);

					curAngle += angle;

					return `<path d="M0 0 
                            L ${joinWithSpace(startCoord)} 
                            A 1 1, 0, ${angle > Math.PI ? '1' : '0'}, 1 
                            ${joinWithSpace(finishCoord)} 
                            Z" 
					fill="${item.color}"></path>
					${createLabel(curAngle - angle / 2, item.name)}
					`;
				})
				.join('');
		}
		this.dom!.innerHTML =
			'<svg width="500" height="500" viewBox="-1.5 -1.5 3 3">' + svgString + '</svg>';
	}
}

function createLabel(angle: number, name: string) {
	const labelCoord = getCoordinate(angle);
	return `
	<g>
		<line 
			x1="${labelCoord[0]}" 
			y1="${labelCoord[1]}" 
			x2="${labelCoord[0] * 1.1}" 
			y2="${labelCoord[1] * 1.1}" 
			style="stroke:rgb(255,0,0);stroke-width:0.01">
		</line>
		<line 
			x1="${labelCoord[0] * 1.1}" 
			y1="${labelCoord[1] * 1.1}" 
			x2="${labelCoord[0] * 1.1 + (angle > Math.PI ? -0.3 : 0.3)}" 
			y2="${labelCoord[1] * 1.1}" 
			style="stroke:rgb(255,0,0);stroke-width:0.01">
		</line>
		<text
			x="${labelCoord[0] * 1.1}"
			y="${labelCoord[1] * 1.1}"
			${angle > Math.PI ? 'dx=-0.3' : ''}
			dy="-0.03"
			font-size="0.1">
			${name}
		</text>
	</g>
	`;
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
