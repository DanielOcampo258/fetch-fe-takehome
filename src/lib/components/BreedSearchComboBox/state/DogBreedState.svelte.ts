import { getAllDogBreeds } from '$lib/api/dogs/utils.svelte';

export class DogBreedsHandler {
	data = $state<string[]>([]);

	fetchAllDogBreeds = async () => {
		this.data = await getAllDogBreeds();
	};
}
