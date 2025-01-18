<script lang="ts">
	import type { LoginError } from '$lib/api/auth/models';
	import { validateLoginData } from '$lib/api/auth/utils';
	import { Button } from '../ui/button';
	import { Input } from '../ui/input';
	import InputErrorHandler from '../ui/input/InputErrorHandler.svelte';
	import { Label } from '../ui/label';

	let error = $state<LoginError>({});

	function submitForm(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		event.preventDefault();

		// First do input validation
		const data = new FormData(event.currentTarget);
		const validationResult = validateLoginData(data);

		if (!validationResult.success) {
			error.validation = validationResult.error.format();
			return;
		}
	}
</script>

<form method="POST" class="flex flex-col gap-4" onsubmit={submitForm}>
	<section class="flex flex-col gap-2">
		<div>
			<Label for="name">Name</Label>
			<Input id="name" name="name" required></Input>
			<InputErrorHandler errors={error?.validation} inputName="name" />
		</div>

		<div>
			<Label for="email">Email</Label>
			<Input id="email" name="email" type="email" required></Input>
			<InputErrorHandler errors={error?.validation} inputName="email" />
		</div>
	</section>

	<Button type="submit" class="mt-2 w-full">Login</Button>
</form>
