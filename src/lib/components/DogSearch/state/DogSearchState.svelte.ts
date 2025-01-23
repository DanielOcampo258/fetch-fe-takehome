import type { Dog, DogSeachApiResponse } from '$lib/api/dogs/models';
import { getDogIds, getDogsFromIds } from '$lib/api/dogs/utils.svelte';

export class DogSearchState {
	dogs = $state<Dog[]>([]);
	apiSearchResponse = $state<DogSeachApiResponse>();
	hasError = $state(false);
	isLoading = $state(false);

	/* NOTE:
      Not sure if this is misunderstanding, but it seems like changing the "from"
      parameter past 9975, will return a 500 status, even though that query total is 10,000
      (at least to me) meaning that there are at least 10000 + 9975 more results. As well as
      setting "from" to 9975, will return the next = "/dogs/search?size=25&from=10000&sort=name%3Aasc"
      But requesting that url results in a 500 status.

      Could just be my misunderstanding! But in the
      case that it was just temporarily not working, this is what the totalDogs state calculation should have been
      to get the accurate number of pages:
      totalDogs = $derived(filterState.from + (dogsSearchResponse?.total ?? 0));
    */
	totalDogs = $derived<number>(this.apiSearchResponse?.total ?? 0);

	getDogsFromQuery = async (queryString: string) => {
		if (!queryString) return;
		this.isLoading = true;

		try {
			this.apiSearchResponse = await getDogIds(queryString);
			this.dogs = await getDogsFromIds(this.apiSearchResponse?.resultIds);
		} catch {
			this.hasError = true;
		} finally {
			this.isLoading = false;
		}
	};
}
