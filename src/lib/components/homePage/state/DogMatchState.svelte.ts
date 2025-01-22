import type { Dog } from '$lib/api/dogs/models';
import { getDogMatch, getDogsFromIds } from '$lib/api/dogs/utils.svelte';

export class DogMatchState {
	matchedDogs = $state<Dog[]>([]);

	fetchDogMatch = async (dogIds: string[], availableDogs: Dog[]) => {
		const dogMatchId = await getDogMatch(dogIds);
		if (!dogMatchId?.match) return;

		// Check if dog is already in current available dogs state
		const matchedDogInState = availableDogs.find((dog) => dog.id === dogMatchId.match);

		if (matchedDogInState) {
			this.matchedDogs.push(matchedDogInState);
			return;
		}
		// Not in state, so we fetch dog data with id
		this.matchedDogs.push((await getDogsFromIds([dogMatchId.match]))[0]);
	};
}
