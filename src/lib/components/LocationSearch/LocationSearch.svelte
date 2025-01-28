<script lang="ts">
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { formatLocationToString } from './utils';
	import { debounce } from '$lib/utils';
	import type { LocationSearchState } from './state/LocationSearchState.svelte';
	import * as Select from '$lib/components/ui/select';
	import { searchRadiusOptions, stateArray, USState } from '$lib/api/location/constants';
	import LoadingSpinner from '../ui/LoadingSpinner/LoadingSpinner.svelte';
	import Label from '../ui/label/label.svelte';
	let { locationSearchState }: { locationSearchState: LocationSearchState } = $props();

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}
</script>

<section class="flex w-full flex-col gap-2">
	<p
		class="text-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
	>
		Location Filtering
	</p>
	<div class="flex gap-2">
		<Label class="visually-hidden" for="state-filter">Filter by state</Label>
		<Select.Root
			type="single"
			onValueChange={(value) => {
				locationSearchState.stateInput = value as USState;
				locationSearchState.resetUserLocationState();
			}}
		>
			<Select.Trigger id="state-filter"
				>{locationSearchState.stateInput || 'Any State'}</Select.Trigger
			>
			<Select.Content side="right">
				{#each stateArray as state}
					<Select.Item aria-label={state} value={state}>{state || 'Any State'}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>

		<Popover.Root bind:open>
			<Label class="visually-hidden" for="city-filter">Filter by city</Label>
			<Popover.Trigger bind:ref={triggerRef} id="city-filter">
				{#snippet child({ props })}
					<Button
						variant="outline"
						class="w-full"
						{...props}
						disabled={locationSearchState.stateInput === USState.EMPTY}
						role="combobox"
						aria-expanded={open}
					>
						{formatLocationToString(locationSearchState.selectedLocation) || 'Specific city'}
					</Button>
				{/snippet}
			</Popover.Trigger>

			<Popover.Content class="p-0">
				<Command.Root>
					<Command.Input
						onkeyup={debounce(
							(e) => (locationSearchState.cityInput = (e.target as HTMLInputElement).value),
							700
						)}
						placeholder="Search for a city..."
					/>
					<Command.List>
						{#if locationSearchState.searchIsLoading}
							<LoadingSpinner />
						{:else if locationSearchState.searchResults.length === 0}
							<p
								class="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none"
							>
								No locations found
							</p>
						{:else}
							{#each locationSearchState.searchResults as locationResult (locationResult.zip_code)}
								<Button
									variant="ghost"
									class="w-full"
									onclick={() => {
										locationSearchState.selectedLocation = locationResult;
										closeAndFocusTrigger();
									}}
								>
									{formatLocationToString(locationResult)}
								</Button>
							{/each}
						{/if}
					</Command.List>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
	</div>

	<Select.Root
		type="single"
		onValueChange={(value) => (locationSearchState.radiusInput = Number(value) || 0)}
	>
		<Label class="text-center" for="search-radius-filter">Search Radius</Label>
		<Select.Trigger id="search-radius-filter" disabled={locationSearchState.cityInput === ''}
			>{locationSearchState.radiusInput} miles</Select.Trigger
		>
		<Select.Content>
			{#each searchRadiusOptions as radiusOption}
				<Select.Item value={radiusOption.toString()}>{radiusOption} miles</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
</section>
