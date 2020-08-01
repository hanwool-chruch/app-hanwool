type Subscriber<T> = (data: T) => void;
export default class Observable<T> {
	private observers: Set<Subscriber<T>>;
	constructor() {
		this.observers = new Set();
	}
	subscribe(observer: Subscriber<T>) {
		this.observers.add(observer);
	}
	unsubscribe(observer: Subscriber<T>): void {
		this.observers = new Set([...this.observers].filter((subscriber) => subscriber !== observer));
	}
	notify(data: T) {
		this.observers.forEach((subscriber) => subscriber(data));
	}
}
