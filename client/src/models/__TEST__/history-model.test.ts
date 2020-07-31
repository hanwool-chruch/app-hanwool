import HistoryModel from '../history-model';
import { History, AddHistoryDto } from '@shared/dto/history-dto';

describe('HistoryModel', () => {
	it('can add histories', async (done) => {
		const obs = new HistoryModel();
		const fn = jest.fn();
		obs.subscribe(fn);

		const hTest1: AddHistoryDto = {
			category: 'cat',
			content: 'cont',
			historyDate: new Date(),
			payment: 'pay',
			price: 100,
		};

		await obs.add(hTest1).then((data) => {
			expect(fn).toBeCalledWith([expect.objectContaining({ ...hTest1, id: expect.any(Number) })]);
		});

		done();
	});

	it('persists consistency', async (done) => {
		const obs = new HistoryModel();
		const fn = jest.fn();
		obs.subscribe(fn);

		const hTest1: AddHistoryDto = {
			category: 'cat',
			content: 'cont',
			historyDate: new Date('2020-01-01'),
			payment: 'pay',
			price: 100,
		};

		const hTest2: AddHistoryDto = {
			category: 'cat2',
			content: 'cont2',
			historyDate: new Date('2020-01-02'),
			payment: 'pay2',
			price: 1000,
		};

		const hTest3: AddHistoryDto = {
			category: 'cat',
			content: 'cont',
			historyDate: new Date('2020-01-03'),
			payment: 'pay',
			price: 100,
		};
		await obs.add(hTest1);
		await obs.add(hTest2);
		await obs.add(hTest3);
		expect(fn).toHaveBeenLastCalledWith([hTest1, hTest2, hTest3].map(expect.objectContaining));
		done();
	});

	it('removes history', async (done) => {
		const obs = new HistoryModel();
		let testData: any;
		const fn = jest.fn((data) => (testData = data[0]));
		obs.subscribe(fn);

		const hTest1: AddHistoryDto = {
			category: 'cat',
			content: 'cont',
			historyDate: new Date(),
			payment: 'pay',
			price: 100,
		};

		await obs.add(hTest1);
		await obs.remove(testData);
		expect(fn).toBeCalledWith([]);
		done();
	});
});
