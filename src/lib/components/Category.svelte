<script lang="ts">
	import type { Category } from '../types';
	import { addChecklistItem } from '../store.svelte';
	import ChecklistItem from './ChecklistItem.svelte';
	import AddItemForm from './AddItemForm.svelte';

	// Props
	let { category } = $props<{
		category: Category;
	}>();

	// Methods
	function handleAddItem(text: string) {
		addChecklistItem(category.id, text);
	}
</script>

<div class="category rounded-lg bg-white p-4 shadow-md">
	<h2 class="mb-3 text-xl font-bold text-blue-700">{category.name}</h2>

	<div class="space-y-1">
		{#each category.items as item}
			<ChecklistItem {item} categoryId={category.id} showAddSubItem={true} />
		{/each}
	</div>

	<div class="mt-4">
		<AddItemForm placeholderText="Add new item to this category..." onSubmit={handleAddItem} />
	</div>
</div>
