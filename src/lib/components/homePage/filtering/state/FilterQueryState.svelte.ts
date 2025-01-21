import type { DogSeachQuery } from '$lib/api/dogs/models';

const INITIAL_EMPTY_FILTER: DogSeachQuery = {
	breeds: [],
	ageMin: null,
	ageMax: null,
	zipCodes: null,
	size: 25,
	from: 1,
	sort: null
};

export class FilterState implements DogSeachQuery {
	breeds = $state(INITIAL_EMPTY_FILTER.breeds);
	ageMin = $state(INITIAL_EMPTY_FILTER.ageMin);
	ageMax = $state(INITIAL_EMPTY_FILTER.ageMax);
	zipCodes = $state(INITIAL_EMPTY_FILTER.zipCodes);

	readonly size = INITIAL_EMPTY_FILTER.size;
	from = INITIAL_EMPTY_FILTER.from;
	sort = INITIAL_EMPTY_FILTER.sort;

	addSelectedBreed = (newBreed: string) => {
		this.breeds = [...this.breeds, newBreed];
	};

	removeSelectedBreed = (breedToRemove: string) => {
		this.breeds = this.breeds.filter((breed) => breed !== breedToRemove);
	};

	// TODO: ADD TESTS
	toQueryParamString = (queryObject: DogSeachQuery) => {
		if (queryObject === INITIAL_EMPTY_FILTER) return '';

		const searchParams = new URLSearchParams();

		for (const [key, value] of Object.entries(queryObject)) {
			if (!value) continue;

			// Check if it is array to handle "breeds" case
			if (Array.isArray(value)) {
				value.forEach((arrayValue) => {
					searchParams.append(key, arrayValue);
				});
			} else {
				searchParams.append(key, value);
			}
		}

		return searchParams.toString();
	};

	queryString = $derived(
		this.toQueryParamString({
			breeds: this.breeds,
			ageMax: this.ageMax,
			ageMin: this.ageMin,
			zipCodes: this.zipCodes,
			size: this.size,
			from: this.from,
			sort: this.sort
		})
	);
}
