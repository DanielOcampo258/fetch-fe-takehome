import { getAllDogBreeds } from '$lib/api/dogs/utils.svelte';

export class DogBreedState {
	dogBreeds = $state<string[]>([]);
	selectedBreeds = $state<string[]>([]);

	fetchAllDogBreeds = async () => {
		this.dogBreeds = await getAllDogBreeds();
	};

	addDogSelectedBreed = (newBreed: string) => {
		this.selectedBreeds = [...this.selectedBreeds, newBreed];
	};

	removeSelectedBreed = (breedToRemove: string) => {
		this.selectedBreeds = this.selectedBreeds.filter((breed) => breed !== breedToRemove);
	};
}
