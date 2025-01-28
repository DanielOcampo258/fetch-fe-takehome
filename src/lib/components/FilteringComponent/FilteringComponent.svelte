<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import type { FilterState } from './state/FilterQueryState.svelte';
	import BreedSearchComboBox from '../BreedSearchComboBox/BreedSearchComboBox.svelte';
	import { DogBreedsHandler } from '../BreedSearchComboBox/state/DogBreedState.svelte';
	import SortingComponent from '../SortingComponent/SortingComponent.svelte';
	import { LocationSearchState } from '../LocationSearch/state/LocationSearchState.svelte';
	import LocationSearch from '../LocationSearch/LocationSearch.svelte';
	import type { LocationApiModel } from '$lib/api/location/models';

	let { filterState }: { filterState: FilterState } = $props();

	const dogBreeds = new DogBreedsHandler();
	const locationSearchState = new LocationSearchState();

	onMount(() => {
		dogBreeds.fetchAllDogBreeds();
	});

	$effect(() => {
		// If filters change, reset to first page
		if (
			filterState.ageMin ||
			filterState.ageMax ||
			filterState.breeds.length ||
			locationSearchState.selectedLocation ||
			locationSearchState.radiusInput
		) {
			untrack(() => (filterState.currentPage = 1));
		}

		// Once user has selected a location, then get first page of zip codes
		if (locationSearchState.selectedLocation) {
			locationSearchState.getLocations().then((data: LocationApiModel[]) => {
				filterState.zipCodes = data.map((location) => location.zip_code);
			});
		} else {
			// If selectedLocation was reset, we reflect that and show all the dogs again
			filterState.zipCodes = null;
		}
	});
</script>

<section class="flex w-full flex-col items-center gap-5 lg:max-w-64">
	<LocationSearch {locationSearchState} />
	<BreedSearchComboBox allDogBreeds={dogBreeds.data} {filterState} />

	<section class="w-full text-center">
		<p
			class="py-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
		>
			Age Range
		</p>

		<div class="flex items-center gap-2">
			<Label for="min-age" class="visually-hidden">Minimum Age</Label>
			<Input
				id="min-age"
				data-testid="min-age"
				bind:value={filterState.ageMin}
				type="number"
				placeholder="min"
			/>

			<span>to</span>

			<Label for="max-age" class="visually-hidden">Maximum Age</Label>
			<Input
				id="max-age"
				data-testid="max-age"
				bind:value={filterState.ageMax}
				type="number"
				placeholder="max"
			/>
		</div>
	</section>

	<SortingComponent
		bind:category={filterState.sortCategory}
		bind:direction={filterState.sortDirection}
	/>
</section>
