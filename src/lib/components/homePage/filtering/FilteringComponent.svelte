<script lang="ts">
	import { onMount } from 'svelte';
	import BreedSearchComboBox from './BreedSearchComboBox.svelte';
	import { DogBreedsHandler } from './state/DogBreedState.svelte';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import type { FilterState } from './state/FilterQueryState.svelte';

	const dogBreeds = new DogBreedsHandler();

	onMount(() => {
		dogBreeds.fetchAllDogBreeds();
	});

	let { filterState = $bindable() }: { filterState: FilterState } = $props();
</script>

<aside class="flex w-full flex-col items-center gap-5 lg:max-w-64">
	<BreedSearchComboBox allDogBreeds={dogBreeds.data} {filterState} />

	<section class="w-full text-center">
		<p
			class="py-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
		>
			Age Range
		</p>

		<div class="flex items-center gap-2">
			<Label for="min-age" class="visually-hidden">Minimum Age</Label>
			<Input id="min-age" bind:value={filterState.ageMin} type="number" placeholder="min" />

			<span>to</span>

			<Label for="max-age" class="visually-hidden">Maximum Age</Label>
			<Input id="max-age" bind:value={filterState.ageMax} type="number" placeholder="max" />
		</div>
	</section>

	<section class="flex w-full flex-col items-center gap-2">
		<Label for="zip-codes">Zip Codes</Label>
		<Input id="zip-codes" bind:value={filterState.zipCodes} placeholder="53713, 53188" />
	</section>
</aside>
