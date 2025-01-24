import type { DogSeachQuery } from '$lib/api/dogs/models';
import type { SortCategory, SortDirection } from './types';

export const INITIAL_SORT_CATEGORY: SortCategory = 'Breed';
export const INITIAL_SORT_DIRECTION: SortDirection = 'Asc';

export const INITIAL_EMPTY_FILTER: DogSeachQuery = {
	breeds: [],
	ageMin: null,
	ageMax: null,
	zipCodes: [''],
	size: 25,
	from: 0,
	sort: `${INITIAL_SORT_CATEGORY.toLowerCase()}:${INITIAL_SORT_DIRECTION.toLowerCase()}`
};
