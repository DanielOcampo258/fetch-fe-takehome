<script lang="ts">
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Select from '$lib/components/ui/select';

	let { category = $bindable(), direction = $bindable() } = $props();
</script>

<section class="flex w-full flex-col items-center gap-2">
	<p
		class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
	>
		Sort
	</p>
	<div class="flex w-full justify-evenly gap-5">
		<Label for="sort-category-filter" class="visually-hidden">Sort Category</Label>
		<Select.Root type="single" bind:value={category}>
			<Select.Trigger id="sort-category-filter" class="w-[180px]">{category}</Select.Trigger>
			<Select.Content>
				<Select.Item value="Breed">Breed</Select.Item>
				<Select.Item value="Name">Name</Select.Item>
				<Select.Item value="Age">Age</Select.Item>
			</Select.Content>
		</Select.Root>

		<Label for="sort-direction-filter" class="visually-hidden">Sort Direction</Label>
		<Select.Root type="single" bind:value={direction}>
			<Select.Trigger id="sort-direction-filter" class="w-[180px]">{direction}</Select.Trigger>
			<Select.Content>
				<Select.Item value="Asc">Asc</Select.Item>
				<Select.Item value="Desc">Desc</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>
</section>
