<script lang="ts">
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import type { DogBreedState } from './state/dogBreedState.svelte';

	let { dogBreedsState }: { dogBreedsState: DogBreedState } = $props();
	let open = $state(false);
	let searchRef = $state<HTMLInputElement>(null!);

	// TODO: ADD TESTS
	function refocusOnSearchBar() {
		tick().then(() => {
			searchRef.focus();
		});
	}
</script>

<article class="w-full text-center">
	<p>Breeds</p>

	<Popover.Root bind:open>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" class="w-full" {...props} role="combobox" aria-expanded={open}>
					{dogBreedsState.selectedBreeds.length > 0
						? `Selected breed(s): ${dogBreedsState.selectedBreeds.length}`
						: 'Any'}
				</Button>
			{/snippet}
		</Popover.Trigger>

		<Popover.Content class="p-0">
			<Command.Root>
				<Command.Input bind:ref={searchRef} placeholder="Search for dog breed" />
				<Command.List>
					<Command.Empty>No Dog Breeds Found</Command.Empty>
					<Command.Group>
						{#each dogBreedsState.dogBreeds as dogBreed}
							<Command.Item class="flex justify-between">
								<Label for={`${dogBreed}-checkbox`}>{dogBreed}</Label>
								<Checkbox
									checked={dogBreedsState.selectedBreeds.includes(dogBreed)}
									id={`${dogBreed}-checkbox`}
									onCheckedChange={(checked) => {
										if (checked) {
											dogBreedsState.addDogSelectedBreed(dogBreed);
										} else {
											dogBreedsState.removeSelectedBreed(dogBreed);
										}
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
