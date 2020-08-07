import Component from '../component';
import { History } from '@shared/dto/history-dto';

export abstract class AbstractContent extends Component {
	// 새로운 기록을 받아서 렌더/업데이트
	abstract load(histories: History[]): void;
}
