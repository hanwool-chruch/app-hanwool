export default abstract class Component {
	protected dom: HTMLElement | null = null;
	getDom(): HTMLElement {
		if (this.dom === null) throw new Error('Initialize dom');
		return this.dom;
	}

	abstract init(): void;
}
