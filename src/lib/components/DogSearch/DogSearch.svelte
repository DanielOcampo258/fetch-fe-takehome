<script lang="ts">
	import type { Dog } from '$lib/api/dogs/models';
	import { Button } from '$lib/components/ui/button';
	import Heart from 'lucide-svelte/icons/heart';

	import FilteringComponent from '../FilteringComponent/FilteringComponent.svelte';
	import { FilterState } from '../FilteringComponent/state/FilterQueryState.svelte';
	import DogPagination from '../DogPagination/DogPagination.svelte';
	import { DogSearchState } from './state/DogSearchState.svelte';
	import DogCard from '../DogCard/DogCard.svelte';
	import LoadingSpinner from '../ui/LoadingSpinner/LoadingSpinner.svelte';

	let { favoritesState, fetchDogMatch } = $props();

	const filterState = new FilterState();
	const dogSearchState = new DogSearchState();

	$effect(() => {
		dogSearchState.getDogsFromQuery(filterState.queryParams);
	});
</script>

<main class="mb-5 bg-[#f1f0f2] {dogSearchState.isLoading ? 'cursor-wait' : 'cursor-auto'}">
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

		{#if dogSearchState.isLoading}
			<LoadingSpinner />
		{:else}
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
		{/if}
	</section>
</main>

<footer class="pb-5">
	<DogPagination
		totalDogs={dogSearchState.totalDogs}
		dogsPerPage={filterState.size}
		bind:currentPage={filterState.currentPage}
	/>
</footer>
