import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { LocationSearchState } from '../state/LocationSearchState.svelte';
import { fireEvent, render, screen } from '@testing-library/svelte';
import LocationSearch from '../LocationSearch.svelte';
import { MockPointerEvent } from '$lib/components/DogSearch/__tests__/utils';
import userEvent from '@testing-library/user-event';
import { getLocationsFromApi } from '$lib/api/location/utils';
import type { LocationApiModel } from '$lib/api/location/models';
import { formatLocationToString } from '../utils';
import { INITIAL_LOCATION_SEARCH_FILTER } from '../constants';

vi.mock('$lib/api/location/utils');

function renderComponent() {
	const locationSearchState = new LocationSearchState();
	render(LocationSearch, { locationSearchState });

	return { locationSearchState };
}

describe('LocationSearch', () => {
	beforeAll(() => {
		// For helping mock shadcn ui select component functionality
		window.PointerEvent = MockPointerEvent as any;
		window.HTMLElement.prototype.scrollIntoView = vi.fn();
		window.HTMLElement.prototype.hasPointerCapture = vi.fn();
		window.HTMLElement.prototype.releasePointerCapture = vi.fn();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.clearAllMocks();
	});

	it('should bind to state filter input and reset selected location when state filter changes', async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

		const { locationSearchState } = renderComponent();

		const resetSpy = vi.spyOn(locationSearchState, 'resetUserLocationState');
		const stateFilterInput = screen.getByLabelText('Filter by state');

		await fireEvent.pointerDown(
			stateFilterInput,
			new MockPointerEvent('pointerdown', {
				ctrlKey: false,
				button: 0
			})
		);

		const arizonaOption = screen.getByText('AZ');
		await user.click(arizonaOption);

		expect(resetSpy).toHaveBeenCalled();
	});

	it('should make api call to get city results upon typing in city filter input', async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		renderComponent();

		const stateFilterInput = screen.getByLabelText('Filter by state') as HTMLInputElement;
		const cityFilterInput = screen.getByLabelText('Filter by city') as HTMLInputElement;

		await fireEvent.pointerDown(
			stateFilterInput,
			new MockPointerEvent('pointerdown', {
				ctrlKey: false,
				button: 0
			})
		);

		const iowaOption = screen.getByText('IA');
		await user.click(iowaOption);

		const mockCity = 'gotham city';
		await user.type(cityFilterInput, mockCity);

		await vi.runAllTimersAsync();

		expect(getLocationsFromApi).toHaveBeenCalledWith(
			expect.objectContaining({
				city: mockCity
			})
		);
	});

	it('should have the filter by city option disabled if state has not been selected', async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		renderComponent();

		const stateFilterInput = screen.getByLabelText('Filter by state') as HTMLInputElement;
		const cityFilterInput = screen.getByLabelText('Filter by city') as HTMLInputElement;

		await fireEvent.pointerDown(
			stateFilterInput,
			new MockPointerEvent('pointerdown', {
				ctrlKey: false,
				button: 0
			})
		);

		const floridaOption = screen.getByText('FL');
		expect(cityFilterInput.disabled).toBe(true);

		await user.click(floridaOption);

		expect(cityFilterInput.disabled).toBe(false);
	});

	it('should have the input filter by search radius to be disabled if a city and state has not been selected', async () => {
		const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
		const mockLocation: LocationApiModel = {
			state: 'GA',
			city: 'midgard',
			zip_code: '82304',
			latitude: 31.1312,
			longitude: -102.1321,
			county: 'Norse world'
		};

		vi.mocked(getLocationsFromApi).mockResolvedValueOnce({
			results: [mockLocation],
			total: 1
		});

		renderComponent();

		const stateFilterInput = screen.getByLabelText('Filter by state') as HTMLInputElement;
		const cityFilterInput = screen.getByLabelText('Filter by city') as HTMLInputElement;
		const searchRadiusFilterInput = screen.getByLabelText('Search Radius') as HTMLInputElement;

		await fireEvent.pointerDown(
			stateFilterInput,
			new MockPointerEvent('pointerdown', {
				ctrlKey: false,
				button: 0
			})
		);

		const georgiaOption = screen.getByText('GA');
		expect(cityFilterInput.disabled).toBe(true);

		await user.click(georgiaOption);

		await user.type(cityFilterInput, 'midgard');

		await vi.runAllTimersAsync();

		const locationSearchResult = screen.getByText(formatLocationToString(mockLocation));

		expect(searchRadiusFilterInput.disabled).toBe(true);
		await fireEvent.click(locationSearchResult);
		expect(searchRadiusFilterInput.disabled).toBe(false);
	});

	it('should show the empty input labels when inputs have not been filled out', async () => {
		renderComponent();

		expect(screen.queryByText('Any State')).not.toBeNull();
		expect(screen.queryByText('Specific city')).not.toBeNull();
		expect(
			screen.queryByText(`${INITIAL_LOCATION_SEARCH_FILTER.radiusInput} miles`)
		).not.toBeNull();
	});
});
