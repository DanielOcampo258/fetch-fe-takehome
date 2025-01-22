import { API_BASE_URL } from '../constants';
import { DogApiRoutes } from './constants';
import type { Dog, DogMatch, DogSeachApiResponse } from './models';

export async function getAllDogBreeds(): Promise<string[]> {
	try {
		const res = await fetch(`${API_BASE_URL}/${DogApiRoutes.getAllBreeds}`, {
			credentials: 'include'
		});
		return await res.json();
	} catch {
		return [];
	}
}

export async function getDogIds(queryString: string): Promise<DogSeachApiResponse> {
	const res = await fetch(`${API_BASE_URL}/${DogApiRoutes.getSearch}?${queryString}`, {
		credentials: 'include'
	});
	return res.json();
}

export async function getDogsFromIds(dogIds: string[]): Promise<Dog[]> {
	const res = await fetch(`${API_BASE_URL}/${DogApiRoutes.postDogsIds}`, {
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify(dogIds)
	});
	return res.json();
}

export async function getDogMatch(dogIds: string[]): Promise<DogMatch | null> {
	if (dogIds.length === 0) return null;

	const res = await fetch(`${API_BASE_URL}/${DogApiRoutes.postDogMatch}`, {
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify(dogIds)
	});

	return res.json();
}
