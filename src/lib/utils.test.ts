import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { debounce } from './utils';

describe('debounce', () => {
	beforeAll(() => {
		vi.useFakeTimers();
	});

	beforeEach(() => {
		vi.clearAllTimers();
	});

	it('should call the callback after the specified delay', () => {
		const callback = vi.fn();
		const delay = 300;
		const debouncedFn = debounce(callback, delay);

		debouncedFn('my arg', 'second arg');

		// Make sure callback has not been called yet
		expect(callback).not.toHaveBeenCalled();

		vi.advanceTimersByTime(delay);

		expect(callback).toHaveBeenCalledTimes(1);

		expect(callback).toHaveBeenCalledWith('my arg', 'second arg');
	});

	it('should reset the timer if called again before the delay', () => {
		const callback = vi.fn();
		const delay = 300;
		const debouncedFn = debounce(callback, delay);

		debouncedFn('my first arg');
		vi.advanceTimersByTime(200);

		// Timeout should reset
		debouncedFn('my second arg');
		vi.advanceTimersByTime(200);

		expect(callback).not.toHaveBeenCalled();

		vi.advanceTimersByTime(100);

		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledWith('my second arg');
	});
});
