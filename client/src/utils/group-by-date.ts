import { History } from '@shared/dto/history-dto';

type DailyListType = {
	day: number;
	dailyHistory: History[];
};

export function groupByDate(histories: History[]): DailyListType[] {
	return histories.reduce((acc: DailyListType[], curHistory: History) => {
		// 그 날이 없으면 그 날 새로 만들기
		if (acc.length === 0 || acc[0].day !== curHistory.historyDate.getDate()) {
			acc.unshift({
				day: curHistory.historyDate.getDate(),
				dailyHistory: [curHistory],
			});
			// 있는 날에 추가
		} else {
			acc[0].dailyHistory.push(curHistory);
		}
		return acc;
	}, []);
}
