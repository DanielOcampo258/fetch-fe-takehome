import { describe, expect, it } from 'vitest';
import { FilterState } from '../state/FilterQueryState.svelte';
import { INITIAL_EMPTY_FILTER } from '../constants';

describe('FilteringState', () => {
	describe('toQueryString', () => {
		const initialParameters = new URLSearchParams();
		initialParameters.append('size', INITIAL_EMPTY_FILTER.size.toString());
		initialParameters.append('from', INITIAL_EMPTY_FILTER.from.toString());
		initialParameters.append('sort', INITIAL_EMPTY_FILTER.sort);

		it('should return query string with just sorting,size, and from parameters when state has not been modified since initialization', () => {
			const filterState = new FilterState();
			const expectedParams = new URLSearchParams(initialParameters);

			expect(filterState.queryString).toEqual(expectedParams.toString());
		});

		it('should format regular primitive values correctly into query paramerter string', () => {
			const filterState = new FilterState();

			// Make some operations to state
			filterState.ageMin = 10;
			filterState.ageMax = 100;
			filterState.currentPage = 5;

			const expectedParams = new URLSearchParams();
			expectedParams.append('ageMax', '100');
			expectedParams.append('ageMin', '10');
			expectedParams.append('size', INITIAL_EMPTY_FILTER.size.toString());
			expectedParams.append('from', '100');
			expectedParams.append('sort', INITIAL_EMPTY_FILTER.sort);

			expect(filterState.queryString).toEqual(expectedParams.toString());
		});

		it('should not include arrays if they are empty or have empty string values', () => {
			const filterState = new FilterState();

			filterState.breeds = [];
			filterState.zipCodeInput = ', , '; // Will result in zipCodes being ["", "", ""]

			const expectedParams = new URLSearchParams(initialParameters);

			expect(filterState.queryString).toEqual(expectedParams.toString());
		});

		it('should include arrays and properly format them if they contain non null or non empty data', () => {
			const filterState = new FilterState();

			filterState.breeds = ['breed1', 'myFavoriteBreed'];
			filterState.zipCodeInput = '12345, 31923'; // Will result in zipCodes being ["12345", "31923"]

			const expectedParams = new URLSearchParams(initialParameters);
			expectedParams.append('breeds', 'breed1');
			expectedParams.append('breeds', 'myFavoriteBreed');

			expectedParams.append('zipCodes', '12345');
			expectedParams.append('zipCodes', '31923');
			expectedParams.sort();

			const result = new URLSearchParams(filterState.queryString);
			result.sort();

			expect(result.toString()).toBe(expectedParams.toString());
		});
	});
});
