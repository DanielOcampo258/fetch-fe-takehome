<script lang="ts">
	import type { Dog, DogSeachApiResponse } from '$lib/api/dogs/models';
	import { getDogIds, getDogsFromIds } from '$lib/api/dogs/utils.svelte';
	import { Button } from '$lib/components/ui/button';
	import Heart from 'lucide-svelte/icons/heart';
	import DogCard from './DogCard.svelte';
	import DogPagination from './filtering/DogPagination.svelte';
	import FilteringComponent from './filtering/FilteringComponent.svelte';
	import { FilterState } from './filtering/state/FilterQueryState.svelte';

	let { favoritesList, fetchDogMatch } = $props();

	const filterState = new FilterState();

	let dogs = $state<Dog[]>([]);
	let dogsSearchResponse = $state<DogSeachApiResponse>();

	/* NOTE:
      Not sure if this is misunderstanding, but it seems like changing the "from"
      parameter past 9975, will return a 500 status, even though that query total is 10,000
      (at least to me) meaning that there are at least 10000 + 9975 more results. As well as
      setting "from" to 9975, will return the next = "/dogs/search?size=25&from=10000&sort=name%3Aasc"
      But requesting that url results in a 500 status.

      Could just be my misunderstanding! But in the
      case that it was just temporarily not working, this is what the totalDogs state calculation should have been
      to get the accurate number of pages:
      totalDogs = $derived(filterState.from + (dogsSearchResponse?.total ?? 0));
    */
	let totalDogs = $derived<number>(dogsSearchResponse?.total ?? 0);

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
				<DogCard {dogData}>
					{#snippet cardAction(dog: Dog)}
						<Button
							aria-label={favoritesList.getAriaLabel(dog)}
							aria-pressed={favoritesList.isFavorited(dog.id)}
							size="icon"
							variant="ghost"
							onclick={() => favoritesList.toggleFavoriteState(dog.id)}
						>
							<Heart fill={favoritesList.isFavorited(dogData.id) ? '#000' : 'none'} />
						</Button>
					{/snippet}
				</DogCard>
			{/each}
		</section>
	</section>
</main>

<footer class="pb-5">
	<DogPagination
		{totalDogs}
		dogsPerPage={filterState.size}
		bind:currentPage={filterState.currentPage}
	/>
</footer>
