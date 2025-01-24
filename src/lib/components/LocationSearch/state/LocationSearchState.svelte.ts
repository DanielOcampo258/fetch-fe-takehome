import { LocationRoutes, USState } from '$lib/api/location/constants';
import type {
	LocationApiModel,
	LocationSearchRequest,
	LocationSearchResponse
} from '$lib/api/location/models';
import { authenticatedFetch } from '$lib/api/utils';

export interface LocationSearchStateType {
	zipCodes: string[];
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
	zipCodes = $state([]);
	selectedLocation = $state<LocationApiModel | null>(null);

	constructor() {
		$effect(() => {
			if (this.cityInput) {
				this.fetchLocations();
			}
		});
	}

	fetchLocations = async () => {
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
}
