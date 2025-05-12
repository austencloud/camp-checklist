<script lang="ts">
	import type { ChecklistItem } from '../types';
	import { toggleChecklistItemCompleted, addChecklistItem } from '../store.svelte';
	import AddItemForm from './AddItemForm.svelte';

	// Props
	let {
		item,
		categoryId,
		level = 0,
		showAddSubItem = false
	} = $props<{
		item: ChecklistItem;
		categoryId: string;
		level?: number;
		showAddSubItem?: boolean;
	}>();

	// State
	let isAddingSubItem = $state(false);

	// Methods
	function handleAddSubItem(text: string) {
		addChecklistItem(categoryId, text, item.id);
		isAddingSubItem = false;
	}
</script>

<div class="pl-{level * 4} py-1">
	<div class="flex items-center gap-2">
		<input
			type="checkbox"
			checked={item.completed}
			on:change={() => toggleChecklistItemCompleted(item.id)}
			class="h-5 w-5"
		/>
		<span
			class="item-text {item.completed ? 'text-gray-500 line-through' : ''}
             {item.isEssential ? 'font-bold' : ''}"
		>
			{item.text}
		</span>

		{#if showAddSubItem && !isAddingSubItem}
			<button
				on:click={() => (isAddingSubItem = true)}
				class="ml-2 rounded bg-gray-200 px-2 py-1 text-xs hover:bg-gray-300"
			>
				+ Sub-item
			</button>
		{/if}
	</div>

	{#if isAddingSubItem}
		<div class="mt-1 pl-8">
			<AddItemForm placeholderText="Add sub-item..." onSubmit={handleAddSubItem} />
		</div>
	{/if}

	{#if item.subItems && item.subItems.length > 0}
		<div class="pl-4">
			{#each item.subItems as subItem}
				<svelte:self item={subItem} {categoryId} level={level + 1} {showAddSubItem} />
			{/each}
		</div>
	{/if}
</div>
