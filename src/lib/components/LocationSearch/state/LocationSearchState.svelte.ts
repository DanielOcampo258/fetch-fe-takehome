import { USState } from '$lib/api/location/constants';
import type { LocationApiModel, LocationSearchRequest } from '$lib/api/location/models';
import { getLocationsFromApi } from '$lib/api/location/utils';
import { INITIAL_LOCATION_SEARCH_FILTER } from '../constants';
import { calculateBoundingBox } from '../utils';

export interface LocationSearchStateType {
	cityInput: string;
	stateInput: USState;
	selectedLocation: LocationApiModel | null;
	radiusInput: number;
	searchResults: LocationApiModel[];
	from: number;
	size: number;
}

export class LocationSearchState implements LocationSearchStateType {
	cityInput = $state(INITIAL_LOCATION_SEARCH_FILTER.cityInput);
	stateInput = $state(INITIAL_LOCATION_SEARCH_FILTER.stateInput);
	radiusInput = $state(INITIAL_LOCATION_SEARCH_FILTER.radiusInput);
	searchResults: LocationApiModel[] = $state(INITIAL_LOCATION_SEARCH_FILTER.searchResults);
	from = $state(INITIAL_LOCATION_SEARCH_FILTER.from);
	selectedLocation = $state(INITIAL_LOCATION_SEARCH_FILTER.selectedLocation);

	readonly size = INITIAL_LOCATION_SEARCH_FILTER.size;

	searchIsLoading = $state(false);

	searchForCities = async () => {
		const citySearchRequest: LocationSearchRequest = {
			city: this.cityInput,
			states: [this.stateInput],
			size: 100
		};

		this.searchIsLoading = true;

		try {
			const data = await getLocationsFromApi(citySearchRequest);
			this.searchResults = data.results;
		} catch {
			this.searchResults = [];
		} finally {
			this.searchIsLoading = false;
		}
	};

	getLocationsWithinRadius = async () => {
		if (!this.selectedLocation) return [];

		const { bottom_left, top_right } = calculateBoundingBox(
			this.selectedLocation.latitude,
			this.selectedLocation.longitude,
			this.radiusInput
		);

		const locationsSearchRequest: LocationSearchRequest = {
			city: this.cityInput,
			geoBoundingBox: {
				bottom_left,
				top_right
			},
			size: this.size
		};

		try {
			const data = await getLocationsFromApi(locationsSearchRequest);
			return data.results;
		} catch {
			return [];
		}
	};

	resetUserLocationState = () => {
		this.cityInput = '';
		this.searchResults = [];
		this.selectedLocation = null;
	};

	updateCityInput = (newValue: string) => {
		this.cityInput = newValue;
		// Recall to look for cities based on new pinput
		if (newValue) this.searchForCities();
	};
}
