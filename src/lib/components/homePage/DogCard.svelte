<script lang="ts">
	import type { Dog } from '$lib/api/dogs/models';
	import * as Card from '$lib/components/ui/card/index';
	import type { Snippet } from 'svelte';

	let { dogData, cardAction }: { dogData: Dog; cardAction?: Snippet<[Dog]> } = $props();
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

			{#if cardAction}
				{@render cardAction(dogData)}
			{/if}
		</section>
	</Card.Footer>
</Card.Root>
