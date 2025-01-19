<script lang="ts">
	import { loginFormState, loginUser, validateLoginData } from '$lib/api/auth/utils.svelte';
	import { Button } from '../ui/button';
	import { Input } from '../ui/input';
	import InputErrorHandler from '../ui/input/InputErrorHandler.svelte';
	import { Label } from '../ui/label';

	async function submitForm(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();
		loginFormState.isSubmitting = true;

		// First do input validation
		const data = new FormData(event.currentTarget);
		const validData = validateLoginData(data);
		if (!validData) return;

		await loginUser(validData);
	}
</script>

<form method="POST" class="flex flex-col gap-4" onsubmit={submitForm}>
	{#if loginFormState.error.apiResponse}
		<p class="rounded-sm bg-red-100 p-4 text-red-900">{loginFormState.error.apiResponse}</p>
	{/if}

	<section class="flex flex-col gap-2">
		<div>
			<Label for="name">Name</Label>
			<Input id="name" name="name" required></Input>
			<InputErrorHandler errors={loginFormState.error?.validation} inputName="name" />
		</div>

		<div>
			<Label for="email">Email</Label>
			<Input id="email" name="email" type="email" required></Input>
			<InputErrorHandler errors={loginFormState.error.validation} inputName="email" />
		</div>
	</section>

	<Button type="submit" class="mt-2 w-full" disabled={loginFormState.isSubmitting}>Login</Button>
</form>
