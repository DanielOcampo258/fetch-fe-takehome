import type { DogSeachQuery } from '$lib/api/dogs/models';
import { INITIAL_EMPTY_FILTER } from '../constants';
import type { SortCategory, SortDirection } from '../types';

export class FilterState implements DogSeachQuery {
	readonly size = INITIAL_EMPTY_FILTER.size;

	breeds = $state(INITIAL_EMPTY_FILTER.breeds);
	ageMin = $state(INITIAL_EMPTY_FILTER.ageMin);
	ageMax = $state(INITIAL_EMPTY_FILTER.ageMax);

	zipCodeInput = $state<string>(INITIAL_EMPTY_FILTER.zipCodes[0]);
	zipCodes = $derived(this.zipCodeInput.split(', '));

	currentPage = $state(1);
	from = $derived((this.currentPage - 1) * this.size);

	sortCategory = $state<SortCategory>('Name');
	sortDirection = $state<SortDirection>('Asc');
	sort = $derived(`${this.sortCategory.toLowerCase()}:${this.sortDirection.toLowerCase()}`);

	addSelectedBreed = (newBreed: string) => {
		this.breeds.push(newBreed);
	};

	removeSelectedBreed = (breedToRemove: string) => {
		this.breeds = this.breeds.filter((breed) => breed !== breedToRemove);
	};

	#toQueryParamString = (queryObject: DogSeachQuery) => {
		if (queryObject === INITIAL_EMPTY_FILTER) return '';

		const searchParams = new URLSearchParams();

		for (const [key, value] of Object.entries(queryObject)) {
			if (value === null || (typeof value === 'string' && value.length === 0)) continue;

			// Check if it is array to handle "breeds" case
			if (Array.isArray(value)) {
				value.forEach((arrayValue) => {
					// Only append valid values
					if (arrayValue) searchParams.append(key, arrayValue);
				});
			} else {
				searchParams.append(key, value);
			}
		}

		return searchParams.toString();
	};

	queryString = $derived(
		this.#toQueryParamString({
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
