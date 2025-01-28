import { searchRadiusOptions, USState } from '$lib/api/location/constants';
import type { LocationSearchStateType } from './state/LocationSearchState.svelte';

export const INITIAL_LOCATION_SEARCH_FILTER: LocationSearchStateType = {
	cityInput: '',
	stateInput: USState.EMPTY,
	radiusInput: searchRadiusOptions[0],
	searchResults: [],
	selectedLocation: null,
	from: 0
};
