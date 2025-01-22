import type { Dog } from '$lib/api/dogs/models';
import { getDogMatch, getDogsFromIds } from '$lib/api/dogs/utils.svelte';

export class DogMatchState {
	matchedDog = $state<Dog | null>(null);

	fetchDogMatch = async (dogIds: string[], availableDogs: Dog[]) => {
		const dogMatchId = await getDogMatch(dogIds);
		if (!dogMatchId) return;

		// Check if dog is already in current available dogs state
		const matchedDogInState = availableDogs.find((dog) => dog.id === dogMatchId);

		if (matchedDogInState) {
			this.matchedDog = matchedDogInState;
			return;
		}
		// Not in state, so we fetch dog data with id
		this.matchedDog = (await getDogsFromIds([dogMatchId]))[0];
	};
}
