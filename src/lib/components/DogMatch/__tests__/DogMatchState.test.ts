import { afterEach, describe, expect, it, vi } from 'vitest';
import { DogMatchState } from '../state/DogMatchState.svelte';
import type { Dog } from '$lib/api/dogs/models';
import { mockDogs } from '../../../testUtils';
import { authenticatedFetch } from '$lib/api/utils';

vi.mock('$lib/api/utils');

describe('DogMatchState', () => {
	describe('fetchDogMatch', () => {
		const mockAxiosPostRequest = vi.mocked(authenticatedFetch.post);

		afterEach(() => {
			vi.clearAllMocks();
		});

		it('should not fetch when an empty list is passed in', async () => {
			const dogMatchState = new DogMatchState();
			await dogMatchState.fetchDogMatch([], mockDogs);

			expect(mockAxiosPostRequest).not.toHaveBeenCalled();
		});

		it('should not call fetch matched dog id from api if returned matched dog id is falsy', async () => {
			const dogMatchState = new DogMatchState();
			const matchApiResponse = { data: { match: '' } };

			mockAxiosPostRequest.mockResolvedValueOnce(matchApiResponse);

			await dogMatchState.fetchDogMatch(
				mockDogs.map((dog) => dog.id),
				mockDogs
			);

			expect(mockAxiosPostRequest).toHaveBeenCalledTimes(1);
		});

		it('should not call fetch matched dog id from api if returned matched dog id is already in matched dog list', async () => {
			const dogMatchState = new DogMatchState();
			dogMatchState.matchedDogs.push(mockDogs[2]);

			const matchApiResponse = { data: { match: mockDogs[2].id } };

			mockAxiosPostRequest.mockResolvedValue(matchApiResponse);

			await dogMatchState.fetchDogMatch(
				mockDogs.map((dog) => dog.id),
				mockDogs
			);

			expect(mockAxiosPostRequest).toHaveBeenCalledTimes(1);
			expect(dogMatchState.matchedDogs).toEqual([mockDogs[2]]);
		});

		it('should not call fetch matched dog id from api if returned matched dog id is in available dogs list', async () => {
			const dogMatchState = new DogMatchState();
			const matchApiResponse = { data: { match: mockDogs[3].id } };

			mockAxiosPostRequest.mockResolvedValueOnce(matchApiResponse);

			await dogMatchState.fetchDogMatch(
				mockDogs.map((dog) => dog.id),
				mockDogs
			);

			expect(mockAxiosPostRequest).toHaveBeenCalledTimes(1);
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

			const matchApiResponse = { data: { match: newMockDog.id } };

			const fetchDogByIdResponse = { data: [newMockDog] };

			mockAxiosPostRequest.mockResolvedValueOnce(matchApiResponse);
			mockAxiosPostRequest.mockResolvedValueOnce(fetchDogByIdResponse);

			await dogMatchState.fetchDogMatch(
				mockDogs.map((dog) => dog.id),
				mockDogs
			);

			expect(authenticatedFetch.post).toHaveBeenCalledTimes(2);
			expect(dogMatchState.matchedDogs).toEqual([newMockDog]);
		});
	});
});
