<script lang="ts">
	import type { Category as CategoryType } from '../types.js';
	import Category from './Category.svelte';
	import AddItemForm from './AddItemForm.svelte';

	// Props
	let { categories, addCategory, addChecklistItem, toggleChecklistItemCompleted } = $props<{
		categories: CategoryType[];
		addCategory: (name: string) => void;
		addChecklistItem: (categoryId: string, text: string, parentItemId?: string) => void;
		toggleChecklistItemCompleted: (itemId: string) => void;
	}>();

	// Methods
	function handleAddCategory(name: string) {
		addCategory(name);
	}
</script>

<div class="mb-6">
	<h2 class="mb-4 text-2xl font-bold text-blue-800">Categories</h2>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each categories as category}
			<Category {category} {addChecklistItem} {toggleChecklistItemCompleted} />
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
