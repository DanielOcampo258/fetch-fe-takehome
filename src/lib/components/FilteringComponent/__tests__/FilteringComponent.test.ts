import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import FilteringComponent from '../FilteringComponent.svelte';
import { FilterState } from '../state/FilterQueryState.svelte';

describe('FilteringComponent', () => {
	describe('Age range filtering', () => {
		it('should have a binding between minimum age input and minimum age state', async () => {
			const user = userEvent.setup();
			const filterState = new FilterState();

			render(FilteringComponent, { filterState });

			const minAgeInput = screen.getByTestId('min-age');
			await user.type(minAgeInput, '25');

			expect(filterState.ageMin).toBe(25);
		});

		it('should have a binding between maximum age input and maximum age state', async () => {
			const user = userEvent.setup();
			const filterState = new FilterState();

			render(FilteringComponent, { filterState });

			const minAgeInput = screen.getByTestId('max-age');
			await user.type(minAgeInput, '48');

			expect(filterState.ageMax).toBe(48);
		});
	});

	describe('Zip code filtering', () => {
		it('should bind zip code input to state, and format the text properly', async () => {
			const user = userEvent.setup();
			const mockZipCodes = '98377, 12345, 76894';
			const filterState = new FilterState();

			render(FilteringComponent, { filterState });

			const zipCodeInput = screen.getByTestId('zip-codes');
			await user.type(zipCodeInput, mockZipCodes);

			expect(filterState.zipCodeInput).toBe(mockZipCodes);
			expect(filterState.zipCodes).toStrictEqual(['98377', '12345', '76894']);
		});
	});
});
