<script lang="ts">
	import type { Dog } from '$lib/api/dogs/models';
	import DogCard from '$lib/components/homePage/DogCard.svelte';
	import BreedSearchComboBox from '$lib/components/homePage/filtering/BreedSearchComboBox.svelte';
	import { DogBreedState } from '$lib/components/homePage/filtering/state/dogBreedState.svelte';
	import { onMount } from 'svelte';

	const dogBreedsState = new DogBreedState();
	let dogs = $state<Dog[]>([]);

	onMount(() => {
		dogBreedsState.fetchAllDogBreeds();
	});
</script>

<header>
	<h1 class="scroll-m-20 p-2 text-4xl font-extrabold tracking-tight lg:text-5xl">
		Fetch Pet Finder
	</h1>
</header>

<main class="flex items-start gap-5 p-12">
	<aside class="flex w-full flex-col items-center lg:max-w-64">
		<BreedSearchComboBox {dogBreedsState} />
	</aside>

	<section class="grid grid-cols-1 gap-5 md:grid-cols-3">
		{#each dogs as dogData}
			<DogCard {dogData} />
		{/each}
	</section>
</main>
