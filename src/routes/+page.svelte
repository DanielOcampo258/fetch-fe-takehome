<script lang="ts">
	import type { Dog } from '$lib/api/dogs/models';
	import { getDogs } from '$lib/api/dogs/utils.svelte';
	import DogCard from '$lib/components/homePage/DogCard.svelte';
	import { onMount } from 'svelte';

	let dogs = $state<Dog[]>([]);

	onMount(async () => {
		dogs = await getDogs();
	});
</script>

<header>
	<h1 class="scroll-m-20 p-2 text-4xl font-extrabold tracking-tight lg:text-5xl">
		Fetch Pet Finder
	</h1>
</header>

<main class="grid grid-cols-1 gap-5 p-16 md:grid-cols-3">
	{#each dogs as dogData}
		<DogCard {dogData} />
	{/each}
</main>
