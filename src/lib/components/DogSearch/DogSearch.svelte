<script lang="ts">
	import type { Dog } from '$lib/api/dogs/models';
	import { Button } from '$lib/components/ui/button';
	import Heart from 'lucide-svelte/icons/heart';

	import FilteringComponent from '../FilteringComponent/FilteringComponent.svelte';
	import { FilterState } from '../FilteringComponent/state/FilterQueryState.svelte';
	import DogPagination from '../DogPagination/DogPagination.svelte';
	import DogCard from '../homePage/DogCard.svelte';
	import { DogSearchState } from './state/DogSearchState.svelte';

	let { favoritesList, fetchDogMatch } = $props();

	const filterState = new FilterState();
	const dogSearchState = new DogSearchState();

	$effect(() => {
		dogSearchState.getDogsFromQuery(filterState.queryString);
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
					fetchDogMatch(Array.from(favoritesList.dogIds), dogSearchState.dogs);
				}}>Find a match from favorites</Button
			>
		</aside>

		<section class="grid grid-cols-1 gap-5 md:grid-cols-3">
			{#each dogSearchState.dogs as dogData (dogData.id)}
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
		totalDogs={dogSearchState.totalDogs}
		dogsPerPage={filterState.size}
		bind:currentPage={filterState.currentPage}
	/>
</footer>
