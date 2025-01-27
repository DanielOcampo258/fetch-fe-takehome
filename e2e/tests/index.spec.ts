import test, { expect, Page } from '@playwright/test';
import { Dog, mockDogs } from '../mock-data/mockDogs';
import { assertDogDataVisibility } from '../utils/index.utils';

enum DogApiRoutes {
	postDogsIds = 'dogs',
	getSearch = 'dogs/search',
	getAllBreeds = 'dogs/breeds',
	postDogMatch = 'dogs/match'
}

test.describe('Index Page', () => {
	test.beforeEach(async ({ page }) => {
		// Mock api routes
		await page.route(`**/${DogApiRoutes.getAllBreeds}`, async (route) => {
			await route.fulfill({ status: 200 });
		});

		await page.route(`**/${DogApiRoutes.getSearch}*`, async (route) => {
			await route.fulfill({
				status: 200,
				json: {
					resultIds: mockDogs.map((dog) => dog.id)
				}
			});
		});

		await page.route(`**/${DogApiRoutes.postDogsIds}`, async (route) => {
			await route.fulfill({ status: 200, json: mockDogs });
		});

		await page.goto('/');
	});

	test('should display all heading and filtering elements', async ({ page }) => {
		await expect(page.getByRole('heading', { name: 'Fetch Pet Finder' })).toBeVisible();

		await expect(page.getByRole('tab', { name: 'Search' })).toBeVisible();
		await expect(page.getByRole('tab', { name: 'View Matches' })).toBeVisible();

		await expect(page.getByRole('combobox', { name: 'Breeds' })).toBeVisible();

		await expect(page.getByLabel('Minimum Age')).toBeVisible();
		await expect(page.getByLabel('Maximum Age')).toBeVisible();

		await expect(page.getByLabel('Zip codes')).toBeVisible();

		await expect(page.getByLabel('Sort Category')).toBeVisible();
		await expect(page.getByLabel('Sort Direction')).toBeVisible();

		await expect(page.getByRole('button', { name: 'Find a match from favorites' })).toBeVisible();
	});

	test('should display all dog card elements on succesfull data fetch', async ({ page }) => {
		for (const dog of mockDogs) {
			await assertDogDataVisibility(page, dog, true);
		}
	});

	test('user can add dogs to favorites and receive a match, and have multiple matches stored', async ({
		page
	}) => {
		// Just picked an arbritatry dog to return
		const firstMatchedDog = mockDogs[1].id;

		// First mocked the response
		await page.route(`**/${DogApiRoutes.postDogMatch}`, async (route) => {
			await route.fulfill({
				status: 200,
				json: {
					match: firstMatchedDog
				}
			});
		});

		// First select a couple of dogs to favorites. Use helper function to get the favorites button a little easier
		const getAriaLabel = (dogData: Dog) => {
			return `Add ${dogData.name}, ${dogData.breed}, located in zip code ${dogData.zip_code} to favorites list`;
		};

		const firstDogFavoriteButton = page.getByLabel(getAriaLabel(mockDogs[0]));
		const secondDogFavoriteButton = page.getByLabel(getAriaLabel(mockDogs[1]));
		const findMatchButton = page.getByRole('button', { name: 'Find a match from favorites' });

		// Add two dogs to favorites
		await firstDogFavoriteButton.click();
		await secondDogFavoriteButton.click();

		// Click on find match
		await findMatchButton.click();

		// Should be on match view
		await expect(page.getByRole('tab', { name: 'View Matches' })).toHaveAttribute(
			'aria-selected',
			'true'
		);

		// Check all dogs visibility
		for (const dog of mockDogs) {
			// Only the match should be visible
			await assertDogDataVisibility(page, dog, dog.id === firstMatchedDog);
		}

		// Add another match
		await page.unroute(`**/${DogApiRoutes.postDogsIds}`);

		const secondMatchedDog = mockDogs[1].id;

		// Second mocked the response
		await page.route(`**/${DogApiRoutes.postDogMatch}`, async (route) => {
			await route.fulfill({
				status: 200,
				json: {
					match: secondMatchedDog
				}
			});
		});

		// Go back to search view
		await page.getByRole('tab', { name: 'Search' }).click();

		await findMatchButton.click();

		// Re-check all dogs visibility
		for (const dog of mockDogs) {
			// Only the first and second match should be visible
			await assertDogDataVisibility(
				page,
				dog,
				dog.id === firstMatchedDog || dog.id === secondMatchedDog
			);
		}
	});
});
