import type { Dog, DogSeachApiResponse, DogSeachQuery } from '$lib/api/dogs/models';
import { getDogIds, getDogsFromIds } from '$lib/api/dogs/utils.svelte';

export class DogSearchState {
	dogs = $state<Dog[]>([]);
	apiSearchResponse = $state<DogSeachApiResponse | null>(null);
	hasError = $state(false);
	isLoading = $state(false);

	totalDogs = $derived<number>(this.apiSearchResponse?.total ?? 0);

	getDogsFromQuery = async (queryParams: DogSeachQuery) => {
		// if (!queryParams) return;
		this.isLoading = true;

		try {
			this.apiSearchResponse = await getDogIds(queryParams);
			this.dogs = await getDogsFromIds(this.apiSearchResponse?.resultIds);
		} catch {
			this.hasError = true;
		} finally {
			this.isLoading = false;
		}
	};
}
