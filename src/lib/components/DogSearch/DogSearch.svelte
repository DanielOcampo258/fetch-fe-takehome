<script lang="ts">
	import type { Dog } from '$lib/api/dogs/models';
	import { Button } from '$lib/components/ui/button';
	import Heart from 'lucide-svelte/icons/heart';

	import FilteringComponent from '../FilteringComponent/FilteringComponent.svelte';
	import { FilterState } from '../FilteringComponent/state/FilterQueryState.svelte';
	import DogPagination from '../DogPagination/DogPagination.svelte';
	import DogCard from '../homePage/DogCard.svelte';
	import { DogSearchState } from './state/DogSearchState.svelte';
	import { untrack } from 'svelte';
	import { FavoritesState } from './state/FavoritesState.svelte';

	let { fetchDogMatch } = $props();

	const favoritesState = new FavoritesState();
	const filterState = new FilterState();
	const dogSearchState = new DogSearchState();

	$effect(() => {
		// If filters change, reset to first page
		if (
			filterState.ageMin ||
			filterState.ageMax ||
			filterState.breeds.length ||
			filterState.zipCodeInput
		) {
			untrack(() => (filterState.currentPage = 1));
		}
	});

	$effect(() => {
		dogSearchState.getDogsFromQuery(filterState.queryParams);
	});
</script>

<main>
	<section class="flex flex-col items-center gap-5 p-12 md:flex-row md:items-start">
		<aside class="top-10 flex flex-col gap-5 md:sticky md:max-w-xs">
			<FilteringComponent {filterState} />
			<Button
				class="w-full"
				disabled={favoritesState.size === 0}
				onclick={() => {
					fetchDogMatch(Array.from(favoritesState.dogIds), dogSearchState.dogs);
				}}>Find a match from favorites</Button
			>
		</aside>

		<section class="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
			{#each dogSearchState.dogs as dogData (dogData.id)}
				<DogCard {dogData}>
					{#snippet cardAction(dog: Dog)}
						<Button
							aria-label={favoritesState.getAriaLabel(dog)}
							aria-pressed={favoritesState.isFavorited(dog.id)}
							size="icon"
							variant="ghost"
							onclick={() => favoritesState.toggleFavoriteState(dog.id)}
						>
							<Heart fill={favoritesState.isFavorited(dogData.id) ? '#000' : 'none'} />
						</Button>
					{/snippet}
				</DogCard>
			{/each}
		</section>
	</section>
</main>

<footer class="pb-5">
	<DogPagination
		totalDogs={dogSearchState.totalDogs}
		dogsPerPage={filterState.size}
		bind:currentPage={filterState.currentPage}
	/>
</footer>
