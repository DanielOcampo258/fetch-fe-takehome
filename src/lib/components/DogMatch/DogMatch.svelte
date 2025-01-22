<script lang="ts">
	import X from 'lucide-svelte/icons/x';
	import DogCard from '../homePage/DogCard.svelte';
	import { Button } from '../ui/button';
	import type { Dog } from '$lib/api/dogs/models';
	import type { DogMatchState } from '../homePage/state/DogMatchState.svelte';

	let { dogMatchState }: { dogMatchState: DogMatchState } = $props();
</script>

<main class="p-12 text-center">
	{#if dogMatchState.matchedDogs.length === 0}
		<h2
			class="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
		>
			Looks like you don't have any matches yet!
		</h2>
		<p class="text-slate-400">Try to add dogs to your favorites list</p>
		<p class="text-slate-400">Then click on "Find a match from favorites"</p>
	{:else}
		<section class="grid grid-cols-1 gap-5 md:grid-cols-3">
			{#each dogMatchState.matchedDogs as dogData (dogData.id)}
				<DogCard {dogData}>
					{#snippet cardAction(dog: Dog)}
						<Button
							size="icon"
							aria-label={`Remove ${dog.name}, ${dog.breed}, located in zip code ${dog.zip_code} from matched list`}
							aria-pressed="false"
							onclick={() => dogMatchState.removeFromMatches(dog.id)}
						>
							<X />
						</Button>
					{/snippet}
				</DogCard>
			{/each}
		</section>
	{/if}
</main>
