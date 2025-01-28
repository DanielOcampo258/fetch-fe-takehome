import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import DogSearch from '../DogSearch.svelte';
import { DogMatchState } from '$lib/components/DogMatch/state/DogMatchState.svelte';
import type { Dog } from '$lib/api/dogs/models';
import { generateMockDogs, mockDogs } from '$lib/testUtils';
import { FavoritesState } from '../state/FavoritesState.svelte';
import { getDogIds, getDogsFromIds } from '$lib/api/dogs/utils.svelte';
import userEvent from '@testing-library/user-event';
import { MockPointerEvent } from './utils';
import { getLocationsFromApi } from '$lib/api/location/utils';
import { formatLocationToString } from '$lib/components/LocationSearch/utils';

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

vi.mock('$lib/api/location/utils.ts');

describe('DogSearch', () => {
	beforeAll(() => {
		Object.defineProperty(globalThis.window, 'scrollTo', { value: mockScrollTo });

		// For helping mock shadcn ui select component functionality
		window.PointerEvent = MockPointerEvent as any;
		window.HTMLElement.prototype.scrollIntoView = vi.fn();
		window.HTMLElement.prototype.hasPointerCapture = vi.fn();
		window.HTMLElement.prototype.releasePointerCapture = vi.fn();
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
			favoritesState,
			fetchDogMatch: matchState.fetchDogMatch
		});

		return { favoritesState };
	}

	describe('Find match button', () => {
		it('should be disabled when favorites list is empty and enabled when list is not empty', async () => {
			const { favoritesState } = renderComponent();

			const findMatchButton = screen.getByText<HTMLButtonElement>('Find a match from favorites');
			expect(findMatchButton.disabled).toBe(true);

			await vi.runAllTimersAsync();

			const toggleFavoritesButton = screen.getByLabelText(favoritesState.getAriaLabel(mockDogs[3]));
			await fireEvent.click(toggleFavoritesButton);

			await vi.runAllTimersAsync();

			expect(findMatchButton.disabled).toBe(false);
		});
	});

	describe('Favorites icon fill state', () => {
		it('should have an unfilled svg when not favorited', async () => {
			const { favoritesState } = renderComponent();
			await vi.runAllTimersAsync();

			const toggleFavoritesButton = screen.getByLabelText(favoritesState.getAriaLabel(mockDogs[1]));

			// Get svg icon to check fill state
			const svgIcon = toggleFavoritesButton.children[0] as SVGElement;

			expect(svgIcon.getAttribute('fill')).toBe('none');
		});

		it('should have a filled state when dog is favorited', async () => {
			const { favoritesState } = renderComponent();
			await vi.runAllTimersAsync();

			const toggleFavoritesButton = screen.getByLabelText(favoritesState.getAriaLabel(mockDogs[2]));

			// Get svg icon to check fill state
			const svgIcon = toggleFavoritesButton.children[0] as SVGElement;

			await fireEvent.click(toggleFavoritesButton);
			expect(svgIcon.getAttribute('fill')).not.toBe('none');
		});
	});

	describe('filtering state', () => {
		beforeEach(() => {
			// Generate more than one page worth of dogs
			const generatedDogs = generateMockDogs(50);
			vi.mocked(getDogIds).mockResolvedValue({
				prev: null,
				total: 50,
				next: null,
				resultIds: generatedDogs.map((dog) => dog.id)
			});

			vi.mocked(getDogsFromIds).mockResolvedValue(generatedDogs);
		});

		describe('page reset on filter change', () => {
			async function goToSecondPage() {
				const pageTwoButton = screen.getByTestId('page-2');
				await fireEvent.click(pageTwoButton);
				return pageTwoButton;
			}

			/**
			 * Helper function to automate getting into the testing state for this block.
			 * The logic is to first switch to the second page, then perform some action that
			 * is passed through the queryCallback. After that is run, we assert that now the
			 * selected page is the first one. Meaning that the passed in queryCallback performed
			 * some action(s) to switch back the page to the first one. Which is what we want to see
			 */
			async function runPageResetTest(queryCallback: () => Promise<void>) {
				renderComponent();
				await vi.runAllTimersAsync();

				const firstPageButton = screen.getByTestId('page-1');
				expect(firstPageButton.getAttribute('data-selected')).not.toBeNull();

				await goToSecondPage();

				// Quick check to make sure we are on the second page
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

			it('should reset page state back to 1 when selected city changes', async () => {
				const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
				const mockCity = {
					zip_code: '2313',
					latitude: 43.0,
					longitude: -80.0,
					city: 'Madison',
					state: 'WI',
					county: 'USA'
				};

				await runPageResetTest(async () => {
					vi.mocked(getLocationsFromApi).mockResolvedValueOnce({
						results: [mockCity],
						total: 1
					});

					const stateFilterSelect = screen.getByLabelText('Filter by state');
					await fireEvent.pointerDown(
						stateFilterSelect,
						new MockPointerEvent('pointerdown', {
							ctrlKey: false,
							button: 0
						})
					);

					//Get the most mid state in all the US
					const wisconsin = screen.getByText('WI');
					await user.click(wisconsin);

					// Type into input
					const cityInput = screen.getByLabelText('Filter by city');
					await user.type(cityInput, 'Madison');

					await vi.runAllTimersAsync();

					const madisonCity = screen.getByText(formatLocationToString(mockCity));
					await fireEvent.click(madisonCity);
				});
			});

			it('should reset page state back to 1 when breeds input changes', async () => {
				await runPageResetTest(async () => {
					const comboboxTrigger = screen.getByLabelText('Breeds');
					await fireEvent.click(comboboxTrigger);

					const affenpinscherCheckBox = screen.getByTestId(`${mockDogs[0].breed}-checkbox`);
					await fireEvent.click(affenpinscherCheckBox);
				});
			});
		});

		describe('dogs shown to user change based on filters', () => {
			beforeAll(() => {});

			it('should call api to filter by breed', async () => {
				renderComponent();

				// Get combobox
				const comboboxTrigger = screen.getByLabelText('Breeds');
				await fireEvent.click(comboboxTrigger);

				// Click on breed filter
				const dogBreedToFilter = mockDogs[2].breed;
				const breedCheckbox = screen.getByLabelText(dogBreedToFilter);

				await fireEvent.click(breedCheckbox);

				// Expect api call
				expect(getDogIds).toHaveBeenCalledWith(
					expect.objectContaining({
						breeds: [dogBreedToFilter]
					})
				);
			});

			it('should call api to filter by age range', async () => {
				const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
				renderComponent();

				const minAge = 0;
				const maxAge = 30;

				// Get min age input and fill it in
				const minAgeInput = screen.getByLabelText('Minimum Age');
				await user.type(minAgeInput, minAge.toString());

				// Get max age input and fill it in
				const maxAgeInput = screen.getByLabelText('Maximum Age');
				await user.type(maxAgeInput, maxAge.toString());

				expect(getDogIds).toHaveBeenCalledWith(
					expect.objectContaining({
						ageMin: minAge,
						ageMax: maxAge
					})
				);
			});

			it('should call api to filter by zip codes', async () => {
				const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

				const mockCity = {
					zip_code: '2313',
					latitude: 43.0,
					longitude: -80.0,
					city: 'Madison',
					state: 'WI',
					county: 'USA'
				};

				vi.mocked(getLocationsFromApi).mockResolvedValue({
					results: [mockCity],
					total: 1
				});
				renderComponent();

				const stateFilterSelect = screen.getByLabelText('Filter by state');
				await fireEvent.pointerDown(
					stateFilterSelect,
					new MockPointerEvent('pointerdown', {
						ctrlKey: false,
						button: 0
					})
				);

				//Get the most mid state in all the US
				const wisconsin = screen.getByText('WI');
				await user.click(wisconsin);

				// Type into input
				const cityInput = screen.getByLabelText('Filter by city');
				await user.type(cityInput, 'Madison');

				await vi.runAllTimersAsync();

				const madisonCity = screen.getByText(formatLocationToString(mockCity));
				await fireEvent.click(madisonCity);

				await vi.runAllTimersAsync();

				expect(getDogIds).toHaveBeenCalledWith(
					expect.objectContaining({
						zipCodes: [mockCity.zip_code]
					})
				);
			});

			it('should call api to filter by sort category and direction', async () => {
				const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

				renderComponent();

				const mockCategory = 'Name';
				const mockDirection = 'Desc';

				// Get both inputs
				const sortCategorySelect = screen.getByLabelText('Sort Category');
				const sortDirectionSelect = screen.getByLabelText('Sort Direction');

				// Use custom pointerdown event class to trigger opening of component
				await fireEvent.pointerDown(
					sortCategorySelect,
					new MockPointerEvent('pointerdown', {
						ctrlKey: false,
						button: 0
					})
				);

				// Get the name option and click on it
				const nameOption = screen.getByText(mockCategory);
				await user.click(nameOption);

				// Now do the same for the category, use the pointerdown implementation
				await fireEvent.pointerDown(
					sortDirectionSelect,
					new MockPointerEvent('pointerdown', {
						ctrlKey: false,
						button: 0
					})
				);

				// select descending option
				const descOption = screen.getByText(mockDirection);
				await user.click(descOption);

				expect(getDogIds).toHaveBeenCalledWith(
					expect.objectContaining({
						sort: `${mockCategory.toLowerCase()}:${mockDirection.toLowerCase()}`
					})
				);
			});
		});
	});
});
