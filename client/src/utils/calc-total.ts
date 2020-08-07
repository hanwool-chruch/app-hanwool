import { History } from '@shared/dto/history-dto';

export function calcTotal(histories: History[]): { earned: number; spent: number } {
	return histories.reduce(
		({ earned, spent }, h) => {
			if (h.price > 0) return { earned: earned + h.price, spent };
			else return { earned, spent: spent - h.price };
		},
		{ earned: 0, spent: 0 }
	);
}
