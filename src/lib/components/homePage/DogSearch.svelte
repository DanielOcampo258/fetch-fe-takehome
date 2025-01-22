<script lang="ts">
	import type { Dog, DogSeachApiResponse } from '$lib/api/dogs/models';
	import { getDogIds, getDogsFromIds } from '$lib/api/dogs/utils.svelte';
	import { Button } from '$lib/components/ui/button';
	import DogCard from './DogCard.svelte';
	import DogPagination from './filtering/DogPagination.svelte';
	import FilteringComponent from './filtering/FilteringComponent.svelte';
	import { FilterState } from './filtering/state/FilterQueryState.svelte';

	let { favoritesList, fetchDogMatch } = $props();

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
			dogs = await getDogsFromIds(dogsSearchResponse.resultIds);
		} catch {
			// TODO: Implement error state
		}
	}

	$effect(() => {
		getDogs(filterState.queryString);
	});
</script>

<main>
	<section class="flex flex-col items-center gap-5 p-12 md:flex-row md:items-start">
		<aside class="top-10 flex flex-col gap-5 md:sticky">
			<FilteringComponent {filterState} />
			<Button
				class="w-full"
				disabled={favoritesList.size === 0}
				onclick={() => {
					fetchDogMatch(Array.from(favoritesList.dogIds), dogs);
				}}>Find a match from favorites</Button
			>
		</aside>

		<section class="grid grid-cols-1 gap-5 md:grid-cols-3">
			{#each dogs as dogData (dogData.id)}
				<DogCard {dogData} {favoritesList} />
			{/each}
		</section>
	</section>
</main>

<footer class="pb-5">
	<DogPagination {pageCount} bind:currentPage={filterState.currentPage} />
</footer>
