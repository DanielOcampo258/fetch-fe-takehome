<script lang="ts">
	import type { Dog } from '$lib/api/dogs/models';
	import * as Card from '$lib/components/ui/card/index';
	import { Button } from '../ui/button';
	import type { FavoritesState } from './state/DogMatching.svelte';
	import Heart from 'lucide-svelte/icons/heart';

	let { dogData, favoritesList }: { dogData: Dog; favoritesList: FavoritesState } = $props();

	let ariaFavoritesLabel = $derived(
		favoritesList.isFavorited(dogData.id)
			? `Remove ${dogData.name}, ${dogData.breed}, located in zip code ${dogData.zip_code} from favorites list`
			: `Add ${dogData.name}, ${dogData.breed}, located in zip code ${dogData.zip_code} to favorites list`
	);
</script>

<Card.Root>
	<Card.Content class="h-72 w-full">
		<img class="h-full w-full rounded-t-lg object-cover" src={dogData.img} alt={dogData.name} />
	</Card.Content>
	<Card.Footer class="">
		<p class="p-2 text-center text-2xl font-bold leading-7">{dogData.name}</p>
		<section class="flex items-end justify-between">
			<div class="flex flex-col gap-2">
				<p class="leading-7"><span class="font-bold">Breed:</span> {dogData.breed}</p>
				<p class="leading-7"><span class="font-bold">Zip Code:</span> {dogData.zip_code}</p>
			</div>

			<Button
				aria-label={ariaFavoritesLabel}
				aria-pressed={favoritesList.isFavorited(dogData.id)}
				size="icon"
				variant="ghost"
				onclick={() => favoritesList.toggleFavoriteState(dogData.id)}
			>
				<Heart fill={favoritesList.isFavorited(dogData.id) ? '#000' : 'none'} />
			</Button>
		</section>
	</Card.Footer>
</Card.Root>
