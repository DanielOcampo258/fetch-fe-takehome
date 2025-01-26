<script lang="ts">
	import { goto } from '$app/navigation';
	import { LoginHandler } from '$lib/api/auth/LoginHandler.svelte';
	import { Button } from '../ui/button';
	import { Input } from '../ui/input';
	import InputErrorHandler from '../ui/input/InputErrorHandler.svelte';
	import { Label } from '../ui/label';

	const loginHandler = new LoginHandler();

	async function submitForm(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();
		loginHandler.isSubmitting = true;

		// First do input validation
		const data = new FormData(event.currentTarget);
		const validData = loginHandler.validateLoginData(data);
		if (!validData) return;

		await loginHandler.loginUser(validData);

		// At this point, if we have no api response error or input error
		// redirect authenticated user to index page
		if (!loginHandler.error.apiResponse) goto('/');
	}
</script>

<form method="POST" class="flex flex-col gap-3" onsubmit={submitForm}>
	{#if loginHandler.error.apiResponse}
		<p class="rounded-sm bg-red-100 p-4 text-red-900">{loginHandler.error?.apiResponse}</p>
	{/if}

	<section class="flex flex-col gap-2">
		<div>
			<Label for="name">Name</Label>
			<Input id="name" data-testid="name" name="name" required></Input>
			<InputErrorHandler errors={loginHandler.error?.validation} inputName="name" />
		</div>

		<div>
			<Label for="email">Email</Label>
			<Input id="email" name="email" data-testid="email" type="email" required></Input>
			<InputErrorHandler errors={loginHandler.error?.validation} inputName="email" />
		</div>
	</section>

	<Button type="submit" class="mt-2 w-full" disabled={loginHandler.isSubmitting}>Login</Button>
</form>
