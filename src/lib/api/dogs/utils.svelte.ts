import { API_BASE_URL } from '../constants';
import { authenticatedFetch } from '../utils';
import { DogApiRoutes } from './constants';
import type { Dog, DogMatch, DogSeachApiResponse } from './models';

export async function getAllDogBreeds(): Promise<string[]> {
	const res = await authenticatedFetch.get(DogApiRoutes.getAllBreeds);
	return res.data;
}

export async function getDogIds(queryString: string): Promise<DogSeachApiResponse> {
	const res = await authenticatedFetch.get(
		`${API_BASE_URL}/${DogApiRoutes.getSearch}?${queryString}`
	);
	return res.data;
}

export async function getDogsFromIds(dogIds: string[]): Promise<Dog[]> {
	if (dogIds.length === 0) return [];

	const res = await authenticatedFetch.post(DogApiRoutes.postDogsIds, dogIds);
	return res.data;
}

export async function getDogMatch(dogIds: string[]): Promise<DogMatch | null> {
	if (dogIds.length === 0) return null;

	const res = await authenticatedFetch.post(DogApiRoutes.postDogMatch, dogIds);
	return res.data;
}
