<script lang="ts">
	import DogMatch from '$lib/components/DogMatch/DogMatch.svelte';
	import { DogMatchState } from '$lib/components/DogMatch/state/DogMatchState.svelte';
	import DogSearch from '$lib/components/DogSearch/DogSearch.svelte';
	import { FavoritesState } from '$lib/components/DogSearch/state/FavoritesState.svelte';
	import Logout from '$lib/components/Logout/Logout.svelte';
	import * as Tabs from '$lib/components/ui/tabs';

	// Keep favorites here to persist favorites when switching between match and search view
	const favoritesState = new FavoritesState();
	const dogMatchState = new DogMatchState();

	let selectedTab = $state<'search' | 'match'>('search');

	$effect(() => {
		// Switch to matched dogs view on new match
		if (dogMatchState.matchedDogs.length > 0) {
			selectedTab = 'match';
		}
	});
</script>

<header class="flex flex-col items-center justify-center p-5">
	<div class="flex w-full items-center justify-between">
		<h1 class="scroll-m-20 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
			Fetch Pet Finder
		</h1>
		<Logout />
	</div>
	<Tabs.Root bind:value={selectedTab}>
		<Tabs.List>
			<Tabs.Trigger value="search">Search</Tabs.Trigger>
			<Tabs.Trigger value="match">View Matches</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>
</header>

{#if selectedTab === 'search'}
	<DogSearch {favoritesState} fetchDogMatch={dogMatchState.fetchDogMatch} />
{:else}
	<DogMatch {dogMatchState} />
{/if}
