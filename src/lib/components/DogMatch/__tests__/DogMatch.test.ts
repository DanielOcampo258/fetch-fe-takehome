import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { DogMatchState } from '../state/DogMatchState.svelte';
import DogMatch from '../DogMatch.svelte';
import type { Dog } from '$lib/api/dogs/models';
import { mockDogs } from '../../../testUtils';
import { authenticatedFetch } from '$lib/api/utils';

const newMockDog: Dog = {
	id: '6',
	img: 'another.png',
	name: 'Wayne',
	breed: 'Corgi',
	age: 2,
	zip_code: '53188'
};

vi.mock('$lib/api/utils');

describe('DogMatch', () => {
	const mockAxiosPostRequest = vi.mocked(authenticatedFetch.post);

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should show an empty matches message when matches list is empty', async () => {
		const dogMatchState = new DogMatchState();

		const matchApiResponse = { data: { match: newMockDog.id } };

		const fetchDogByIdResponse = { data: [newMockDog] };

		mockAxiosPostRequest.mockResolvedValueOnce(matchApiResponse);
		mockAxiosPostRequest.mockResolvedValueOnce(fetchDogByIdResponse);

		render(DogMatch, { dogMatchState });

		expect(screen.queryByText("Looks like you don't have any matches yet!")).not.toBeNull();

		await dogMatchState.fetchDogMatch(
			mockDogs.map((dog) => dog.id),
			mockDogs
		);

		expect(screen.queryByText("Looks like you don't have any matches yet!")).toBeNull();
	});

	it('should display dog card when valid data is received from match api', async () => {
		const dogMatchState = new DogMatchState();

		const matchApiResponse = { data: { match: newMockDog.id } };

		const fetchDogByIdResponse = { data: [newMockDog] };

		mockAxiosPostRequest.mockResolvedValueOnce(matchApiResponse);
		mockAxiosPostRequest.mockResolvedValueOnce(fetchDogByIdResponse);

		render(DogMatch, { dogMatchState });

		await dogMatchState.fetchDogMatch(
			mockDogs.map((dog) => dog.id),
			mockDogs
		);

		expect(screen.queryByTestId(`dog-card-${newMockDog.id}`)).not.toBeNull();
	});

	it('should remove dog from match list when remove dog match button is clicked', async () => {
		const dogMatchState = new DogMatchState();

		const matchApiResponse = { data: { match: newMockDog.id } };

		const fetchDogByIdResponse = { data: [newMockDog] };

		mockAxiosPostRequest.mockResolvedValueOnce(matchApiResponse);
		mockAxiosPostRequest.mockResolvedValueOnce(fetchDogByIdResponse);

		render(DogMatch, { dogMatchState });

		await dogMatchState.fetchDogMatch(
			mockDogs.map((dog) => dog.id),
			mockDogs
		);

		expect(dogMatchState.matchedDogs).toEqual([newMockDog]);

		const removeMatchButton = screen.getByTestId(`remove-dog-match-${newMockDog.id}`);
		await fireEvent.click(removeMatchButton);

		expect(dogMatchState.matchedDogs).toEqual([]);
	});
});
