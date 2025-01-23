import { fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import DogPagination from '../DogPagination.svelte';

const mockScrollTo = vi.fn();

describe('Dog Pagination', () => {
	beforeAll(() => {
		Object.defineProperty(globalThis.window, 'scrollTo', { value: mockScrollTo });
	});

	afterEach(() => {
		mockScrollTo.mockReset();
	});

	it('should display the correct number of pages with given props', () => {
		const totalDogs = 101;
		const dogsPerPage = 5;
		let currentPage = $state(1);

		const expectedNumberOfPages = Math.ceil(totalDogs / dogsPerPage);

		render(DogPagination, { dogsPerPage, totalDogs, currentPage });

		const lastPageButton = screen.getByTestId(`page-${expectedNumberOfPages}`);
		expect(lastPageButton).not.toBeNull();
		expect(lastPageButton);

		// Get the pagination unordered list
		const paginationRootList = screen.getByTestId('pagination-root').children[0];

		// The last element is the Next button, and the second to last button is the last available page
		// And we get that child to get the inner element of the list item
		const secondToLastListElement = paginationRootList.children.item(
			paginationRootList.childElementCount - 2
		)?.children[0];

		expect(secondToLastListElement).toBe(lastPageButton);
	});

	it('the correct page is selected and scrolls to top on page change', async () => {
		const totalDogs = 50;
		const dogsPerPage = 8;
		let currentPage = $state(1);

		render(DogPagination, { dogsPerPage, totalDogs, currentPage });

		// Get the pagination unordered list
		const firstPage = screen.getByTestId('page-1');
		const seventhPage = screen.getByTestId('page-7');

		await fireEvent.click(seventhPage);

		expect(mockScrollTo).toHaveBeenCalled();
		expect(firstPage.getAttribute('data-selected')).toBeNull();
		expect(seventhPage.getAttribute('data-selected')).not.toBeNull();
	});
});
