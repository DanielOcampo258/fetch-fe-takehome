<script lang="ts">
	import DogSearch from '$lib/components/homePage/DogSearch.svelte';
	import { DogMatchState } from '$lib/components/homePage/state/DogMatchState.svelte';
	import { FavoritesState } from '$lib/components/homePage/state/FilterState.svelte';
	import * as Tabs from '$lib/components/ui/tabs';

	const favoritesList = new FavoritesState();
	const dogMatchState = new DogMatchState();

	let selectedTab = $state<'search' | 'match'>('search');

	$effect(() => {
		// Switch to matchmatchedDogsbs on new match
		if (dogMatchState.matchedDogs.length > 0) {
			selectedTab = 'match';
		}
	});
</script>

<header class="flex flex-col items-center justify-center">
	<h1 class="scroll-m-20 p-2 text-4xl font-extrabold tracking-tight lg:text-5xl">
		Fetch Pet Finder
	</h1>
	<Tabs.Root bind:value={selectedTab} class="">
		<Tabs.List>
			<Tabs.Trigger value="search">Search</Tabs.Trigger>
			<Tabs.Trigger value="match">View Matches</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>
</header>

{#if selectedTab === 'search'}
	<DogSearch {favoritesList} fetchDogMatch={dogMatchState.fetchDogMatch} />
{/if}
