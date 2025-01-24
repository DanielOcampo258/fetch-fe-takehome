import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import DogSearch from '../DogSearch.svelte';
import { DogMatchState } from '$lib/components/DogMatch/state/DogMatchState.svelte';
import type { Dog } from '$lib/api/dogs/models';
import { generateMockDogs, mockDogs } from '$lib/testUtils';
import { FavoritesState } from '../state/FavoritesState.svelte';
import { getDogIds, getDogsFromIds } from '$lib/api/dogs/utils.svelte';
import userEvent from '@testing-library/user-event';

const mockScrollTo = vi.fn();

vi.mock('$lib/api/dogs/utils.svelte', async () => {
	const actual = await vi.importActual('$lib/api/dogs/utils.svelte');
	const { mockDogs }: { mockDogs: Dog[] } = await vi.importActual('$lib/testUtils');

	return {
		...actual,
		getDogIds: vi.fn().mockResolvedValue(mockDogs.map((dog) => dog.id)),
		getDogsFromIds: vi.fn().mockResolvedValue(mockDogs),
		getAllDogBreeds: vi.fn().mockResolvedValue(mockDogs.map((dog) => dog.breed))
	};
});

describe('DogSearch', () => {
	beforeAll(() => {
		Object.defineProperty(globalThis.window, 'scrollTo', { value: mockScrollTo });
		vi.useFakeTimers();
	});

	beforeEach(() => {
		vi.clearAllMocks();
		vi.clearAllTimers();
	});

	afterEach(() => {
		mockScrollTo.mockReset();
	});

	function renderComponent() {
		const matchState = new DogMatchState();
		const favoritesState = new FavoritesState();

		render(DogSearch, {
			fetchDogMatch: matchState.fetchDogMatch
		});

		return { getFormattedAriaLabel: favoritesState.getAriaLabel };
	}

	describe('Find match button', () => {
		it('should be disabled when favorites list is empty and enabled when list is not empty', async () => {
			const { getFormattedAriaLabel } = renderComponent();

			const findMatchButton = screen.getByText<HTMLButtonElement>('Find a match from favorites');
			expect(findMatchButton.disabled).toBe(true);

			await vi.runAllTimersAsync();

			const toggleFavoritesButton = screen.getByLabelText(getFormattedAriaLabel(mockDogs[3]));
			await fireEvent.click(toggleFavoritesButton);

			await vi.runAllTimersAsync();

			expect(findMatchButton.disabled).toBe(false);
		});
	});

	describe('Favorites icon fill state', () => {
		it('should have an unfilled svg when not favorited', async () => {
			const { getFormattedAriaLabel } = renderComponent();
			await vi.runAllTimersAsync();

			const toggleFavoritesButton = screen.getByLabelText(getFormattedAriaLabel(mockDogs[1]));

			const svgIcon = toggleFavoritesButton.children[0] as SVGElement;

			expect(svgIcon.getAttribute('fill')).toBe('none');
		});

		it('should have a filled state when dog is favorited', async () => {
			const { getFormattedAriaLabel } = renderComponent();
			await vi.runAllTimersAsync();

			const toggleFavoritesButton = screen.getByLabelText(getFormattedAriaLabel(mockDogs[2]));

			const svgIcon = toggleFavoritesButton.children[0] as SVGElement;
			await fireEvent.click(toggleFavoritesButton);
			expect(svgIcon.getAttribute('fill')).not.toBe('none');
		});
	});

	describe('filtering state', () => {
		beforeEach(() => {
			// Generate more than one page worth of dogs
			vi.mocked(getDogIds).mockResolvedValue({
				prev: null,
				total: 50,
				next: null,
				resultIds: generateMockDogs(50).map((dog) => dog.id)
			});

			vi.mocked(getDogsFromIds).mockResolvedValue(generateMockDogs(50));
		});

		async function goToSecondPage() {
			const pageTwoButton = screen.getByTestId('page-2');
			await fireEvent.click(pageTwoButton);
			return pageTwoButton;
		}

		async function runPageResetTest(queryCallback: () => Promise<void>) {
			renderComponent();
			await vi.runAllTimersAsync();

			const firstPageButton = screen.getByTestId('page-1');
			expect(firstPageButton.getAttribute('data-selected')).not.toBeNull();

			await goToSecondPage();
			expect(firstPageButton.getAttribute('data-selected')).toBeNull();

			// This will call and start whatever interaction
			// we are testing to make sure it resets the page back to the first one
			await queryCallback();

			expect(firstPageButton.getAttribute('data-selected')).not.toBeNull();
		}

		it('should reset page state back to 1 when min age input changes', async () => {
			const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

			await runPageResetTest(async () => {
				const minAgeInput = screen.getByTestId('max-age');
				await user.type(minAgeInput, '25');
			});
		});

		it('should reset page state back to 1 when max age input changes', async () => {
			const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

			await runPageResetTest(async () => {
				const maxAgeInput = screen.getByTestId('max-age');
				await user.type(maxAgeInput, '25');
			});
		});

		it('should reset page state back to 1 when zipcode input changes', async () => {
			const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
			await runPageResetTest(async () => {
				const zipCodeInput = screen.getByTestId('zip-codes');
				await user.type(zipCodeInput, '31233');
				await vi.runAllTimersAsync();
			});
		});

		it('should reset page state back to 1 when breeds input changes', async () => {
			await runPageResetTest(async () => {
				const comboboxTrigger = screen.getByRole('combobox');
				await fireEvent.click(comboboxTrigger);

				const affenpinscherCheckBox = screen.getByTestId(`${mockDogs[0].breed}-checkbox`);
				await fireEvent.click(affenpinscherCheckBox);
			});
		});
	});
});
