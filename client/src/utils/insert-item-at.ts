export function insertAt<T>(list: T[], item: T, i: number): T[] {
	return [...list.slice(0, i), item, ...list.slice(i)];
}
