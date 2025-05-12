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

<div class="checklist-item" style="--indent-level: {level};">
	<div class="item-row">
		<label class="item-label">
			<input
				type="checkbox"
				checked={item.completed}
				onchange={handleToggleCompleted}
				class={item.completed ? 'checkbox-checked' : ''}
				aria-label={`Mark "${item.text}" as ${item.completed ? 'incomplete' : 'complete'}`}
			/>
			<span class="item-text" class:completed={item.completed} class:essential={item.isEssential}>
				{item.text}
			</span>
		</label>

		{#if showAddSubItem && !isAddingSubItem}
			<button onclick={handleAddSubItemClick} class="add-subitem-button" aria-label="Add sub-item">
				<span class="button-icon">+</span>
				<span class="button-text">Sub-item</span>
			</button>
		{/if}
	</div>

	{#if isAddingSubItem}
		<div class="subitem-form">
			<AddItemForm placeholderText="Add sub-item..." buttonText="Add" onSubmit={handleAddSubItem} />
		</div>
	{/if}

	{#if item.subItems && item.subItems.length > 0}
		<div class="subitems-container">
			{#each item.subItems as subItem, index}
				<div class="subitem-wrapper slide-in-right" style="animation-delay: {index * 50}ms">
					<Self
						item={subItem}
						{categoryId}
						{toggleChecklistItemCompleted}
						{addChecklistItem}
						level={level + 1}
						{showAddSubItem}
					/>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.checklist-item {
		padding-left: calc(var(--indent-level) * var(--spacing-4));
		margin-bottom: var(--spacing-2);
	}

	.item-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--spacing-2) var(--spacing-1);
		border-radius: var(--border-radius-md);
		transition: background-color var(--transition-duration-fast) var(--transition-timing-default);
	}

	.item-row:hover {
		background-color: var(--color-neutral-100);
	}

	.item-label {
		display: flex;
		align-items: center;
		gap: var(--spacing-3);
		cursor: pointer;
		flex: 1;
	}

	.item-text {
		transition:
			color var(--transition-duration-normal) var(--transition-timing-default),
			text-decoration var(--transition-duration-normal) var(--transition-timing-default);
	}

	.completed {
		color: var(--color-text-tertiary);
		text-decoration: line-through;
	}

	.essential {
		font-weight: var(--font-weight-bold);
		color: var(--color-primary-700);
	}

	.essential.completed {
		color: var(--color-primary-400);
	}

	.add-subitem-button {
		display: flex;
		align-items: center;
		gap: var(--spacing-1);
		padding: var(--spacing-1) var(--spacing-2);
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
		background-color: var(--color-neutral-100);
		border: none;
		border-radius: var(--border-radius-md);
		transition:
			background-color var(--transition-duration-fast) var(--transition-timing-default),
			transform var(--transition-duration-fast) var(--transition-timing-default);
	}

	.add-subitem-button:hover {
		background-color: var(--color-neutral-200);
		transform: translateY(-1px);
	}

	.add-subitem-button:focus-visible {
		outline: 2px solid var(--color-primary-500);
		outline-offset: 2px;
	}

	.button-icon {
		font-weight: var(--font-weight-bold);
	}

	.subitem-form {
		margin-top: var(--spacing-2);
		margin-left: var(--spacing-6);
		margin-bottom: var(--spacing-3);
	}

	.subitems-container {
		margin-top: var(--spacing-1);
	}

	.subitem-wrapper {
		margin-bottom: var(--spacing-1);
	}

	/* Dark mode adjustments */
	:global([data-theme='dark']) .item-row:hover {
		background-color: var(--color-neutral-800);
	}

	:global([data-theme='dark']) .add-subitem-button {
		background-color: var(--color-neutral-800);
	}

	:global([data-theme='dark']) .add-subitem-button:hover {
		background-color: var(--color-neutral-700);
	}

	:global([data-theme='dark']) .essential {
		color: var(--color-primary-300);
	}

	:global([data-theme='dark']) .essential.completed {
		color: var(--color-primary-500);
	}
</style>
