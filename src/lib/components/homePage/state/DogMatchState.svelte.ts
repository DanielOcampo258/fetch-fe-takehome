import type { Dog } from '$lib/api/dogs/models';
import { getDogMatch, getDogsFromIds } from '$lib/api/dogs/utils.svelte';

export class DogMatchState {
	matchedDogs = $state<Dog[]>([]);

	#isDogIdInMatchedList = (searchId: string) => {
		return this.matchedDogs.some((matchedDog) => matchedDog.id === searchId);
	};

	fetchDogMatch = async (dogIds: string[], availableDogs: Dog[]) => {
		const dogMatchId = await getDogMatch(dogIds);
		if (!dogMatchId?.match) return;

		// If dog is already in matched just create a shallow copy of list to still trigger
		// switching tab view to matched dogs
		if (this.#isDogIdInMatchedList(dogMatchId.match)) {
			this.matchedDogs = [...this.matchedDogs];
			return;
		}

		// Check if dog is already in current available dogs state
		const matchedDogInState = availableDogs.find((dog) => dog.id === dogMatchId.match);

		if (matchedDogInState) {
			this.matchedDogs.push(matchedDogInState);
			return;
		}
		// Not in state, so we fetch dog data with id
		this.matchedDogs.push((await getDogsFromIds([dogMatchId.match]))[0]);
	};

	removeFromMatches = (dogIdToRemove: string) => {
		this.matchedDogs = this.matchedDogs.filter((matchedDog) => matchedDog.id !== dogIdToRemove);
	};
}
