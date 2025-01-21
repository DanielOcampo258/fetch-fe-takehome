import type { DogSeachQuery } from '$lib/api/dogs/models';

type SortCategory = 'Name' | 'Breed' | 'Age';
type SortDirection = 'Asc' | 'Desc';

const INITIAL_SORT_CATEGORY: SortCategory = 'Name';
const INITIAL_SORT_DIRECTION: SortDirection = 'Asc';

const INITIAL_EMPTY_FILTER: DogSeachQuery = {
	breeds: [],
	ageMin: null,
	ageMax: null,
	zipCodes: null,
	size: 25,
	from: 0,
	sort: `${INITIAL_SORT_CATEGORY.toLowerCase()}:${INITIAL_SORT_DIRECTION.toLowerCase()}`
};

export class FilterState implements DogSeachQuery {
	readonly size = INITIAL_EMPTY_FILTER.size;

	breeds = $state(INITIAL_EMPTY_FILTER.breeds);
	ageMin = $state(INITIAL_EMPTY_FILTER.ageMin);
	ageMax = $state(INITIAL_EMPTY_FILTER.ageMax);
	zipCodes = $state(INITIAL_EMPTY_FILTER.zipCodes);

	currentPage = $state(1);
	from = $derived((this.currentPage - 1) * this.size);

	sortCategory = $state<SortCategory>('Name');
	sortDirection = $state<SortDirection>('Asc');
	sort = $derived(`${this.sortCategory.toLowerCase()}:${this.sortDirection.toLowerCase()}`);

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
