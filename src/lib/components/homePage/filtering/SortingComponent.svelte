<script lang="ts">
	import * as Select from '$lib/components/ui/select';

	let { category = $bindable(), direction = $bindable() } = $props();
</script>

<section class="flex w-full flex-col items-center gap-2">
	<p
		class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
	>
		Sort
	</p>
	<div class="flex w-full gap-5">
		<Select.Root type="single" bind:value={category}>
			<Select.Trigger class="w-[180px]">{category}</Select.Trigger>
			<Select.Content>
				<Select.Item value="Breed">Breed</Select.Item>
				<Select.Item value="Name">Name</Select.Item>
				<Select.Item value="Age">Age</Select.Item>
			</Select.Content>
		</Select.Root>

		<Select.Root type="single" bind:value={direction}>
			<Select.Trigger class="w-[180px]">{direction}</Select.Trigger>
			<Select.Content>
				<Select.Item value="Asc">Asc</Select.Item>
				<Select.Item value="Desc">Desc</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>
</section>
