import { afterEach, describe, expect, it, vi } from 'vitest';
import { DogMatchState } from '../state/DogMatchState.svelte';
import type { Dog } from '$lib/api/dogs/models';
import { mockDogs } from './constants';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('DogMatchState', () => {
	describe('fetchDogMatch', () => {
		afterEach(() => {
			mockFetch.mockReset();
		});

		it('should not fetch when an empty list is passed in', async () => {
			const dogMatchState = new DogMatchState();
			await dogMatchState.fetchDogMatch([], mockDogs);

			expect(mockFetch).not.toHaveBeenCalled();
		});

		it('should not call fetch matched dog id from api if returned matched dog id is falsy', async () => {
			const dogMatchState = new DogMatchState();
			const matchApiResponse = {
				json: vi.fn().mockResolvedValueOnce({
					match: ''
				})
			};
			mockFetch.mockResolvedValue(matchApiResponse);

			await dogMatchState.fetchDogMatch(
				mockDogs.map((dog) => dog.id),
				mockDogs
			);

			expect(mockFetch).toHaveBeenCalledTimes(1);
		});

		it('should not call fetch matched dog id from api if returned matched dog id is already in matched dog list', async () => {
			const dogMatchState = new DogMatchState();
			dogMatchState.matchedDogs.push(mockDogs[2]);

			const matchApiResponse = {
				json: vi.fn().mockResolvedValueOnce({
					match: mockDogs[2].id
				})
			};
			mockFetch.mockResolvedValue(matchApiResponse);

			await dogMatchState.fetchDogMatch(
				mockDogs.map((dog) => dog.id),
				mockDogs
			);

			expect(mockFetch).toHaveBeenCalledTimes(1);
			expect(dogMatchState.matchedDogs).toEqual([mockDogs[2]]);
		});

		it('should not call fetch matched dog id from api if returned matched dog id is in available dogs list', async () => {
			const dogMatchState = new DogMatchState();
			const matchApiResponse = {
				json: vi.fn().mockResolvedValueOnce({
					match: mockDogs[3].id
				})
			};
			mockFetch.mockResolvedValue(matchApiResponse);

			await dogMatchState.fetchDogMatch(
				mockDogs.map((dog) => dog.id),
				mockDogs
			);

			expect(mockFetch).toHaveBeenCalledTimes(1);
			expect(dogMatchState.matchedDogs).toEqual([mockDogs[3]]);
		});

		it('should call fetch matched dog id from api if returned matched dog id is not in available dogs list', async () => {
			const dogMatchState = new DogMatchState();
			const newMockDog: Dog = {
				id: '5',
				img: 'example-img.png',
				name: 'Bruce',
				breed: 'Corgi',
				age: 3,
				zip_code: '53713'
			};

			const matchApiResponse = {
				json: vi.fn().mockResolvedValueOnce({
					match: newMockDog.id
				})
			};

			const fetchDogByIdResponse = {
				json: vi.fn().mockResolvedValueOnce([newMockDog])
			};

			mockFetch.mockResolvedValueOnce(matchApiResponse);
			mockFetch.mockResolvedValueOnce(fetchDogByIdResponse);

			await dogMatchState.fetchDogMatch(
				mockDogs.map((dog) => dog.id),
				mockDogs
			);

			expect(mockFetch).toHaveBeenCalledTimes(2);
			expect(dogMatchState.matchedDogs).toEqual([newMockDog]);
		});
	});
});
