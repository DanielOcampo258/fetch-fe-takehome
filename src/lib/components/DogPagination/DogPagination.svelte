<script lang="ts">
	import * as Pagination from '$lib/components/ui/pagination';

	let { totalDogs: count, dogsPerPage: perPage, currentPage = $bindable() } = $props();

	function scrollToTop() {
		window.scrollTo({ top: 0 });
	}
</script>

<Pagination.Root
	data-testid="pagination-root"
	{count}
	{perPage}
	bind:page={currentPage}
	onPageChange={scrollToTop}
>
	{#snippet children({ pages, currentPage })}
		<Pagination.Content>
			<Pagination.Item>
				<Pagination.PrevButton>
					<span class="hidden sm:block">Previous</span>
				</Pagination.PrevButton>
			</Pagination.Item>
			{#each pages as page (page.key)}
				{#if page.type === 'ellipsis'}
					<Pagination.Item>
						<Pagination.Ellipsis />
					</Pagination.Item>
				{:else}
					<Pagination.Item>
						<Pagination.Link
							data-testid="page-{page.value}"
							{page}
							isActive={currentPage === page.value}
						>
							{page.value}
						</Pagination.Link>
					</Pagination.Item>
				{/if}
			{/each}
			<Pagination.Item>
				<Pagination.NextButton>
					<span class="hidden sm:block">Next</span>
				</Pagination.NextButton>
			</Pagination.Item>
		</Pagination.Content>
	{/snippet}
</Pagination.Root>
