<script lang="ts">
	let { errors, inputName } = $props();
</script>

{#if errors && errors[inputName]}
	<!-- Only show the first error to not overwhelm user with a bunch of error messages-->
	<span data-testid={`input-validation-error-${inputName}`} class="text-red-400"
		>{errors[inputName]._errors[0]}</span
	>
{/if}
