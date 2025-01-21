<script lang="ts">
	import type { Dog } from '$lib/api/dogs/models';
	import DogCard from '$lib/components/homePage/DogCard.svelte';
	import FilteringComponent from '$lib/components/homePage/filtering/FilteringComponent.svelte';
	import { FilterState } from '$lib/components/homePage/filtering/state/FilterQueryState.svelte';

	const filterState = new FilterState();
	let dogs = $state<Dog[]>([]);
</script>

<header>
	<h1 class="scroll-m-20 p-2 text-4xl font-extrabold tracking-tight lg:text-5xl">
		Fetch Pet Finder
	</h1>
</header>

<main class="flex items-start gap-5 p-12">
	<FilteringComponent {filterState} />
	<section class="grid grid-cols-1 gap-5 md:grid-cols-3">
		{#each dogs as dogData}
			<DogCard {dogData} />
		{/each}
	</section>
</main>
