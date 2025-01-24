<script lang="ts">
	import { onMount, tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import type { FilterState } from '../FilteringComponent/state/FilterQueryState.svelte';

	let { allDogBreeds, filterState }: { allDogBreeds: string[]; filterState: FilterState } =
		$props();
	let open = $state(false);
	let searchRef = $state<HTMLInputElement>(null!);
	let comboboxButton = $state<HTMLInputElement>(null!);

	onMount(() => {
		// Work around for accessibility as regular shadcn-ui buttons are given pre-existing ids
		comboboxButton.id = 'dog-breed-combobox-trigger';
	});

	function refocusOnSearchBar() {
		tick().then(() => {
			searchRef.focus();
		});
	}
</script>

<article class="w-full text-center">
	<Label for="combobox-trigger">Breeds</Label>

	<Popover.Root bind:open>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button
					bind:ref={comboboxButton}
					variant="outline"
					class="w-full"
					{...props}
					role="combobox"
					aria-expanded={open}
				>
					{filterState.breeds.length > 0
						? `Selected breed(s): ${filterState.breeds.length}`
						: 'Any'}
				</Button>
			{/snippet}
		</Popover.Trigger>

		<Popover.Content class="p-0">
			<Command.Root>
				<Command.Input
					data-testid="breed-search-input"
					bind:ref={searchRef}
					placeholder="Search for dog breed"
				/>
				<Command.List>
					<Command.Empty>No Dog Breeds Found</Command.Empty>
					<Command.Group>
						{#each allDogBreeds as dogBreed}
							<Command.Item class="flex justify-between">
								<Label for={`${dogBreed}-checkbox`}>{dogBreed}</Label>
								<Checkbox
									checked={filterState.breeds.includes(dogBreed)}
									id={`${dogBreed}-checkbox`}
									data-testid={`${dogBreed}-checkbox`}
									onCheckedChange={(checked) => {
										if (checked) {
											filterState.addSelectedBreed(dogBreed);
										} else {
											filterState.removeSelectedBreed(dogBreed);
										}

										refocusOnSearchBar();
									}}
								/>
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
</article>
