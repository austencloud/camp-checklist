<script lang="ts">
	import type { ChecklistItem } from '../types.js';
	import AddItemForm from './AddItemForm.svelte';
	import DeleteButton from './DeleteButton.svelte';
	// Self-import for recursive rendering (replacing svelte:self)
	import Self from './ChecklistItem.svelte';

	// Props
	let {
		item,
		categoryId,
		toggleChecklistItemCompleted,
		addChecklistItem,
		deleteItem,
		level = 0,
		showAddSubItem = false
	} = $props<{
		item: ChecklistItem;
		categoryId: string;
		toggleChecklistItemCompleted: (itemId: string) => void;
		addChecklistItem: (categoryId: string, text: string, parentItemId?: string) => void;
		deleteItem: (itemId: string, parentItemId?: string) => void;
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

	function handleDeleteItem() {
		deleteItem(item.id);
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

		<div class="item-actions">
			<DeleteButton itemName={item.text} itemType="item" onDelete={handleDeleteItem} small={true} />

			{#if showAddSubItem && !isAddingSubItem}
				<button
					onclick={handleAddSubItemClick}
					class="add-subitem-button"
					aria-label="Add sub-item"
				>
					<span class="button-icon">+</span>
				</button>
			{/if}
		</div>
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
						{deleteItem}
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
		padding-left: calc(
			var(--indent-level) * clamp(0.5rem, 2vw, 0.75rem)
		); /* Fluid indent that scales with viewport */
		margin-bottom: var(--item-spacing); /* Fluid spacing between items */
		width: 100%;
		min-width: 0; /* Ensure the item can shrink */
	}

	.item-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--spacing-2) var(--container-spacing);
		border-radius: var(--border-radius-md);
		transition: background-color var(--transition-duration-fast) var(--transition-timing-default);
		min-height: var(--touch-target-size); /* Fluid touch target height */
		width: 100%;
		min-width: 0; /* Ensure content can shrink */
	}

	/* Active state for touch feedback */
	.item-row:active {
		background-color: var(--color-primary-50);
	}

	.item-actions {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
		opacity: 1; /* Always visible for better UX */
		transition: opacity var(--transition-duration-fast) var(--transition-timing-default);
		flex-shrink: 0; /* Prevent shrinking */
	}

	.item-row:hover {
		background-color: var(--color-light-hover-bg);
		color: var(--color-light-hover-text);
	}

	.item-label {
		display: flex;
		align-items: center;
		gap: var(--spacing-3);
		cursor: pointer;
		flex: 1;
		min-height: var(--touch-target-size); /* Fluid touch target height */
		padding: var(--spacing-1) 0;
		min-width: 0; /* Ensure label can shrink */
		word-break: break-word; /* Ensure text wraps properly */
		overflow-wrap: break-word; /* Ensure long words break */
		hyphens: auto; /* Enable hyphenation */
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
		padding: var(--spacing-2) var(--container-spacing);
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		background-color: var(--color-neutral-100);
		border: none;
		border-radius: var(--border-radius-md);
		transition:
			background-color var(--transition-duration-fast) var(--transition-timing-default),
			color var(--transition-duration-fast) var(--transition-timing-default),
			transform var(--transition-duration-fast) var(--transition-timing-default);
		min-height: var(--touch-target-size); /* Fluid touch target height */
		touch-action: manipulation; /* Prevent double-tap zoom on mobile */
		white-space: nowrap; /* Prevent text wrapping */
	}

	.add-subitem-button:hover {
		background-color: var(--color-primary-100);
		color: var(--color-primary-900);
		transform: translateY(-1px);
	}

	/* Active state for touch feedback */
	.add-subitem-button:active {
		background-color: var(--color-primary-200);
		transform: translateY(0);
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
		background-color: var(--color-dark-hover-bg); /* Using our new custom hover color */
		color: var(--color-dark-hover-text); /* Ensuring text is visible on hover */
	}

	:global([data-theme='dark']) .add-subitem-button {
		background-color: var(--color-neutral-800);
		color: var(--color-text-secondary); /* Improved text contrast */
	}

	:global([data-theme='dark']) .add-subitem-button:hover {
		background-color: var(--color-primary-700); /* More visible hover state */
		color: var(--color-neutral-50); /* Better text contrast on hover */
	}

	:global([data-theme='dark']) .essential {
		color: var(--color-primary-200); /* Lighter color for better contrast */
	}

	:global([data-theme='dark']) .essential.completed {
		color: var(--color-primary-400); /* Brighter color for completed essential items */
	}

	:global([data-theme='dark']) .completed {
		color: var(--color-text-tertiary);
		text-decoration: line-through;
		opacity: 0.8; /* Slightly more visible than default */
	}

	/* We're using a fluid design approach instead of fixed breakpoints */
	/* The component will automatically adapt to any screen width */
</style>
