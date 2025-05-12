<script lang="ts">
	import type { ChecklistItem } from '../types.js';
	import AddItemForm from './AddItemForm.svelte';
	import DeleteButton from './DeleteButton.svelte';
	// Self-import for recursive rendering
	import Self from './ChecklistItem.svelte';

	// Props
	let {
		item,
		categoryId,
		toggleChecklistItemCompleted,
		addChecklistItem,
		deleteItem,
		level = 0,
		showAddSubItem = false,
		itemIdForLabel = '' // New prop to link ARIA label from parent
	} = $props<{
		item: ChecklistItem;
		categoryId: string;
		toggleChecklistItemCompleted: (itemId: string) => void;
		addChecklistItem: (categoryId: string, text: string, parentItemId?: string) => void;
		deleteItem: (itemId: string, parentItemId?: string) => void;
		level?: number;
		showAddSubItem?: boolean;
		itemIdForLabel?: string; // Prop type definition
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
		// Pass the parent ID (if it exists) to the delete function
		// Note: This component doesn't know its *direct* parent's ID when nested.
		// The parent component (Category.svelte or another ChecklistItem)
		// needs to handle finding the correct parent when calling deleteItem.
		// For simplicity here, we assume deleteItem can handle finding the item
		// based on its own ID, potentially needing the categoryId.
		// If deleting sub-items requires the immediate parent's ID,
		// that ID would need to be passed down as a prop.
		deleteItem(item.id /*, potentialParentIdProp */);
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
			<span
				id={itemIdForLabel}
				class="item-text"
				class:completed={item.completed}
				class:essential={item.isEssential}
			>
				{item.text}
			</span>
		</label>

		<div class="item-actions">
			<DeleteButton itemName={item.text} itemType="item" onDelete={handleDeleteItem} small={true} />

			{#if showAddSubItem && !isAddingSubItem && level < 2} <button
					type="button"
					onclick={handleAddSubItemClick}
					class="add-subitem-button"
					aria-label="Add sub-item"
				>
					<span class="button-icon" aria-hidden="true">+</span>
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
			{#each item.subItems as subItem, index (subItem.id)}
				<div class="subitem-wrapper slide-in-right" style="animation-delay: {index * 50}ms">
					<Self
						item={subItem}
						{categoryId}
						{toggleChecklistItemCompleted}
						{addChecklistItem}
						{deleteItem}
						level={level + 1}
						showAddSubItem={showAddSubItem} itemIdForLabel="item-text-{subItem.id}" />
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.checklist-item {
		/* Fluid indent based on nesting level */
		padding-left: calc(
			var(--indent-level) * clamp(0.5rem, 2vw, 0.75rem)
		);
		margin-bottom: var(--item-spacing); /* Fluid spacing */
		width: 100%;
		min-width: 0; /* Allow shrinking */
	}

	.item-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--spacing-2) var(--container-spacing); /* Fluid padding */
		border-radius: var(--border-radius-md);
		transition: background-color var(--transition-duration-fast) var(--transition-timing-default);
		min-height: var(--touch-target-size); /* Fluid touch target */
		width: 100%;
		min-width: 0; /* Allow shrinking */
	}

	/* Active state for touch feedback */
	.item-row:active {
		background-color: var(--color-primary-50);
	}

	.item-actions {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
		opacity: 1; /* Always visible */
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
		flex: 1; /* Take available space */
		min-height: var(--touch-target-size); /* Fluid touch target */
		padding: var(--spacing-1) 0;
		min-width: 0; /* Allow shrinking */
		word-break: break-word; /* Wrap long text */
		overflow-wrap: break-word;
		hyphens: auto;
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
		color: var(--color-primary-400); /* Lighter when completed */
	}

	.add-subitem-button {
		display: flex;
		align-items: center;
		justify-content: center; /* Center the '+' icon */
		gap: var(--spacing-1);
		padding: var(--spacing-1); /* Slightly smaller padding */
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		background-color: var(--color-neutral-100);
		border: none;
		border-radius: var(--border-radius-md);
		transition:
			background-color var(--transition-duration-fast) var(--transition-timing-default),
			color var(--transition-duration-fast) var(--transition-timing-default),
			transform var(--transition-duration-fast) var(--transition-timing-default);
		/* Ensure minimum touch target size, even with smaller padding */
		min-width: clamp(1.8rem, 7vw, 2rem);
		min-height: clamp(1.8rem, 7vw, 2rem);
		touch-action: manipulation; /* Prevent double-tap zoom */
		white-space: nowrap; /* Prevent text wrapping */
		line-height: 1; /* Ensure '+' is centered vertically */
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
		font-size: 1.2em; /* Make '+' slightly larger */
	}

	.subitem-form {
		margin-top: var(--spacing-2);
		/* Indent form slightly more than the item itself */
		padding-left: clamp(0.5rem, 2vw, 0.75rem);
		margin-bottom: var(--spacing-3);
	}

	.subitems-container {
		margin-top: var(--spacing-1);
        /* Optional: Add a subtle left border to visually group sub-items */
        /* border-left: 2px solid var(--color-neutral-200); */
        /* padding-left: var(--spacing-2); */
	}

	.subitem-wrapper {
		margin-bottom: var(--spacing-1); /* Smaller margin for sub-items */
	}

	/* Dark mode adjustments */
	:global([data-theme='dark']) .item-row:hover {
		background-color: var(--color-dark-hover-bg);
		color: var(--color-dark-hover-text);
	}

	:global([data-theme='dark']) .add-subitem-button {
		background-color: var(--color-neutral-800);
		color: var(--color-text-secondary);
	}

	:global([data-theme='dark']) .add-subitem-button:hover {
		background-color: var(--color-primary-700);
		color: var(--color-neutral-50);
	}

	:global([data-theme='dark']) .essential {
		color: var(--color-primary-200);
	}

	:global([data-theme='dark']) .essential.completed {
		color: var(--color-primary-400);
	}

	:global([data-theme='dark']) .completed {
		color: var(--color-text-tertiary);
		opacity: 0.8; /* Slightly more visible */
	}

    /* :global([data-theme='dark']) .subitems-container {
        border-left-color: var(--color-neutral-700);
    } */
</style>
