<script lang="ts">
	import { categories, addCategory } from '../store.svelte';
	import Category from './Category.svelte';
	import AddItemForm from './AddItemForm.svelte';

	// Methods
	function handleAddCategory(name: string) {
		addCategory(name);
	}
</script>

<div class="mb-6">
	<h2 class="mb-4 text-2xl font-bold text-blue-800">Categories</h2>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each categories as category}
			<Category {category} />
		{/each}
	</div>

	<div class="mt-6 max-w-md">
		<AddItemForm
			placeholderText="Add new category..."
			buttonText="Add Category"
			onSubmit={handleAddCategory}
		/>
	</div>
</div>
