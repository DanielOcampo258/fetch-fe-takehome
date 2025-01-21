<script lang="ts">
	import { onMount } from 'svelte';
	import BreedSearchComboBox from './BreedSearchComboBox.svelte';
	import { DogBreedsHandler } from './state/DogBreedState.svelte';

	const dogBreeds = new DogBreedsHandler();

	onMount(() => {
		dogBreeds.fetchAllDogBreeds();
	});

	let { filterState = $bindable() } = $props();
</script>

<aside class="flex w-full flex-col items-center lg:max-w-64">
	<BreedSearchComboBox allDogBreeds={dogBreeds.data} {filterState} />
</aside>
