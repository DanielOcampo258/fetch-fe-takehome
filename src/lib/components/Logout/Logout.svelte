<script lang="ts">
	import { goto } from '$app/navigation';
	import { AuthRoutes } from '$lib/api/auth/constants';
	import { authenticatedFetch } from '$lib/api/utils';
	import Button from '../ui/button/button.svelte';

	async function logout() {
		await authenticatedFetch.post(AuthRoutes.Logout);
		goto('/login');
	}
</script>

<Button onclick={logout}>Logout</Button>
