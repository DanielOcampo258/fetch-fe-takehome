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

	size = INITIAL_EMPTY_FILTER.size;
	from = INITIAL_EMPTY_FILTER.from;
	sort = INITIAL_EMPTY_FILTER.sort;

	addSelectedBreed = (newBreed: string) => {
		this.breeds = [...this.breeds, newBreed];
	};

	removeSelectedBreed = (breedToRemove: string) => {
		this.breeds = this.breeds.filter((breed) => breed !== breedToRemove);
	};
}
