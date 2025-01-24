import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function debounce<T extends unknown[]>(callback: (...args: T) => void, msDelay = 300) {
	let timer: ReturnType<typeof setTimeout>;

	return (...args: T) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			callback(...args);
		}, msDelay);
	};
}
