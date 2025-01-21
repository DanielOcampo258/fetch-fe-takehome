<script lang="ts">
	import type { Dog, DogSeachApiResponse } from '$lib/api/dogs/models';
	import { getDogIds, getDogMatches } from '$lib/api/dogs/utils.svelte';
	import DogCard from '$lib/components/homePage/DogCard.svelte';
	import DogPagination from '$lib/components/homePage/filtering/DogPagination.svelte';
	import FilteringComponent from '$lib/components/homePage/filtering/FilteringComponent.svelte';
	import { FilterState } from '$lib/components/homePage/filtering/state/FilterQueryState.svelte';

	const filterState = new FilterState();
	let dogs = $state<Dog[]>([]);
	let dogsSearchResponse = $state<DogSeachApiResponse>();

	let pageCount = $derived.by(() => {
		if (!dogsSearchResponse?.total) return 1;
		return Math.ceil(dogsSearchResponse.total / filterState.size);
	});

	async function getDogs(queryString: string) {
		try {
			dogsSearchResponse = await getDogIds(queryString);
			dogs = await getDogMatches(dogsSearchResponse);
		} catch {
			// TODO: Implement error state
		}
	}

	$effect(() => {
		getDogs(filterState.queryString);
	});
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

<footer class="pb-5">
	<DogPagination {pageCount} bind:currentPage={filterState.currentPage} />
</footer>
