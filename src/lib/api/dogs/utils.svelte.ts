import { API_BASE_URL } from '../constants';
import { DogApiRoutes } from './constants';
import type { Dog, DogSeachApiResponse } from './models';

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

export async function getDogs(): Promise<Dog[]> {
	try {
		const dogIds = await getDogIds();
		const dogData = await getDogMatches(dogIds);
		return dogData;
	} catch {
		return [];
	}
}

async function getDogIds(): Promise<DogSeachApiResponse> {
	const res = await fetch(`${API_BASE_URL}/${DogApiRoutes.getSearch}`, {
		credentials: 'include'
	});
	return res.json();
}

async function getDogMatches(dogIds: DogSeachApiResponse): Promise<Dog[]> {
	const res = await fetch(`${API_BASE_URL}/${DogApiRoutes.postDogMatches}`, {
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify(dogIds.resultIds)
	});
	return res.json();
}
