// import Observerble from '../../utils/observable';

// describe('Observerble', () => {
// 	it('acts properly', () => {
// 		const fn1 = jest.fn();
// 		const fn2 = jest.fn();
// 		const observer = new Observerble();
// 		observer.subscribe(fn1);
// 		observer.subscribe(fn2);

// 		observer.notify(1);

// 		expect(fn1).toBeCalledWith(1);
// 		expect(fn2).toBeCalledWith(1);

// 		observer.unsubscribe(fn1);
// 		observer.notify(2);

// 		expect(fn1).toBeCalledTimes(1);
// 		expect(fn2).toBeCalledTimes(2);
// 	});
// });
