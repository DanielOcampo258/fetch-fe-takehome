import { LocationRoutes, USState } from '$lib/api/location/constants';
import type {
	LocationApiModel,
	LocationSearchRequest,
	LocationSearchResponse
} from '$lib/api/location/models';
import { authenticatedFetch } from '$lib/api/utils';
import { calculateBoundingBox } from '../utils';

export interface LocationSearchStateType {
	cityInput: string;
	selectedLocation: LocationApiModel | null;
	radiusInput: number;
	searchResults: LocationApiModel[];
}

export class LocationSearchState implements LocationSearchStateType {
	cityInput = $state('');
	stateInput = $state<USState>(USState.EMPTY);
	radiusInput = $state(5);
	searchResults: LocationApiModel[] = $state([]);
	searchIsLoading = $state(false);
	from = $state(0);
	selectedLocation = $state<LocationApiModel | null>(null);

	constructor() {
		$effect(() => {
			if (this.cityInput) {
				this.searchForCities();
			}
		});
	}

	searchForCities = async () => {
		const citySearchRequest: LocationSearchRequest = {
			city: this.cityInput,
			states: [this.stateInput],
			size: 100
		};

		this.searchIsLoading = true;

		try {
			const res = await authenticatedFetch.post(
				LocationRoutes.getLocationsSearch,
				citySearchRequest
			);

			const data = res.data as LocationSearchResponse;
			this.searchResults = data.results;
		} catch {
			this.searchResults = [];
		} finally {
			this.searchIsLoading = false;
		}
	};

	getLocations = async () => {
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
			size: 100
		};

		try {
			const res = await authenticatedFetch.post(
				LocationRoutes.getLocationsSearch,
				locationsSearchRequest
			);

			return res.data.results;
		} catch {
			return [];
		}
	};

	resetUserLocationState = () => {
		this.cityInput = '';
		this.selectedLocation = null;
	};
}
