import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeEach, beforeAll, describe, expect, it, vi } from 'vitest';
import FilteringComponent from '../FilteringComponent.svelte';
import { FilterState } from '../state/FilterQueryState.svelte';

describe('FilteringComponent', () => {
	beforeAll(() => {
		vi.useFakeTimers();
	});

	beforeEach(() => {
		vi.clearAllTimers();
	});

	describe('Age range filtering', () => {
		it('should have a binding between minimum age input and minimum age state', async () => {
			const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
			const filterState = new FilterState();

			render(FilteringComponent, { filterState });

			const minAgeInput = screen.getByTestId('min-age');
			await user.type(minAgeInput, '25');

			expect(filterState.ageMin).toBe(25);
		});

		it('should have a binding between maximum age input and maximum age state', async () => {
			const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
			const filterState = new FilterState();

			render(FilteringComponent, { filterState });

			const minAgeInput = screen.getByTestId('max-age');
			await user.type(minAgeInput, '48');

			expect(filterState.ageMax).toBe(48);
		});
	});
});
