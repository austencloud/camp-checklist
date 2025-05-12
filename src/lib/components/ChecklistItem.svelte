<script lang="ts">
	import type { ChecklistItem } from '../types.js';
	import AddItemForm from './AddItemForm.svelte';
	// Self-import for recursive rendering (replacing svelte:self)
	import Self from './ChecklistItem.svelte';

	// Props
	let {
		item,
		categoryId,
		toggleChecklistItemCompleted,
		addChecklistItem,
		level = 0,
		showAddSubItem = false
	} = $props<{
		item: ChecklistItem;
		categoryId: string;
		toggleChecklistItemCompleted: (itemId: string) => void;
		addChecklistItem: (categoryId: string, text: string, parentItemId?: string) => void;
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

	function handleToggleCompleted() {
		toggleChecklistItemCompleted(item.id);
	}

	function handleAddSubItemClick() {
		isAddingSubItem = true;
	}
</script>

<div class="pl-{level * 4} py-1">
	<div class="flex items-center gap-2">
		<input
			type="checkbox"
			checked={item.completed}
			onchange={handleToggleCompleted}
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
				onclick={handleAddSubItemClick}
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
				<Self
					item={subItem}
					{categoryId}
					{toggleChecklistItemCompleted}
					{addChecklistItem}
					level={level + 1}
					{showAddSubItem}
				/>
			{/each}
		</div>
	{/if}
</div>
