<script lang="ts">
	import type { Dog } from '$lib/api/dogs/models';
	import { getDogs } from '$lib/api/dogs/utils.svelte';
	import { onMount } from 'svelte';

	let dogs = $state<Dog[]>([]);

	onMount(async () => {
		dogs = await getDogs();
	});
</script>
