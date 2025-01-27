import { expect, Page } from '@playwright/test';
import { Dog } from '../mock-data/mockDogs';

/*
 * Helper function to assert that dog is visible or not
 *
 */
export async function assertDogDataVisibility(page: Page, dog: Dog, isVisible: boolean) {
	await expect(page.getByText(dog.name)).toBeVisible({
		visible: isVisible
	});
	await expect(page.getByText(dog.breed)).toBeVisible({
		visible: isVisible
	});
	await expect(page.getByText(dog.zip_code)).toBeVisible({
		visible: isVisible
	});
	await expect(page.getByText(`Age: ${dog.age}`)).toBeVisible({
		visible: isVisible
	});
	await expect(page.getByAltText(dog.name)).toBeVisible({
		visible: isVisible
	});
}
