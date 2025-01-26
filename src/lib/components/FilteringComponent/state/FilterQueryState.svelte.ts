import type { DogSeachQuery } from '$lib/api/dogs/models';
import { INITIAL_EMPTY_FILTER, INITIAL_SORT_CATEGORY, INITIAL_SORT_DIRECTION } from '../constants';
import type { SortCategory, SortDirection } from '../types';

export class FilterState implements DogSeachQuery {
	readonly size = INITIAL_EMPTY_FILTER.size;

	breeds = $state(INITIAL_EMPTY_FILTER.breeds);
	ageMin = $state(INITIAL_EMPTY_FILTER.ageMin);
	ageMax = $state(INITIAL_EMPTY_FILTER.ageMax);

	zipCodeInput = $state<string>(INITIAL_EMPTY_FILTER.zipCodes?.[0] ?? '');
	zipCodes = $derived.by(() => (this.zipCodeInput ? this.zipCodeInput.split(', ') : null));

	currentPage = $state(1);
	from = $derived((this.currentPage - 1) * this.size);

	sortCategory = $state<SortCategory>(INITIAL_SORT_CATEGORY);
	sortDirection = $state<SortDirection>(INITIAL_SORT_DIRECTION);
	sort = $derived(`${this.sortCategory.toLowerCase()}:${this.sortDirection.toLowerCase()}`);

	queryParams = $derived<DogSeachQuery>({
		breeds: this.breeds,
		ageMax: this.ageMax,
		ageMin: this.ageMin,
		zipCodes: this.zipCodes,
		size: this.size,
		from: this.from,
		sort: this.sort
	});

	addSelectedBreed = (newBreed: string) => {
		this.breeds.push(newBreed);
	};

	removeSelectedBreed = (breedToRemove: string) => {
		this.breeds = this.breeds.filter((breed) => breed !== breedToRemove);
	};
}
