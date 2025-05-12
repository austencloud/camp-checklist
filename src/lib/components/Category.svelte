<script lang="ts">
	import type { Category, ChecklistItem as ChecklistItemType } from '../types.js';
	import ChecklistItem from './ChecklistItem.svelte';
	import AddItemForm from './AddItemForm.svelte';
	import DeleteButton from './DeleteButton.svelte';
	import { slide } from 'svelte/transition';

	// Props
	let {
		category,
		addChecklistItem,
		toggleChecklistItemCompleted,
		deleteCategory,
		deleteChecklistItem
	} = $props<{
		category: Category;
		addChecklistItem: (categoryId: string, text: string, parentItemId?: string) => void;
		toggleChecklistItemCompleted: (itemId: string) => void;
		deleteCategory: (categoryId: string) => void;
		deleteChecklistItem: (categoryId: string, itemId: string, parentItemId?: string) => void;
	}>();

	// State
	let isExpanded = $state(true);

	// Methods
	function handleAddItem(text: string) {
		addChecklistItem(category.id, text);
	}

	function toggleExpand() {
		isExpanded = !isExpanded;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			toggleExpand();
		}
	}

	function handleDeleteCategory() {
		deleteCategory(category.id);
	}

	function handleDeleteItem(itemId: string, parentItemId?: string) {
		deleteChecklistItem(category.id, itemId, parentItemId);
	}

	// Computed
	const completedItemsCount = $derived(
		category.items.filter((item: ChecklistItemType) => item.completed).length
	);

	const totalItemsCount = $derived(category.items.length);

	const progress = $derived(
		totalItemsCount > 0 ? Math.round((completedItemsCount / totalItemsCount) * 100) : 0
	);

	// Cubic out easing function
	function cubicOut(t: number): number {
		const f = t - 1.0;
		return f * f * f + 1.0;
	}
</script>

<div class="category-card" role="region" aria-label="Category">
	<div
		class="category-header"
		role="button"
		tabindex="0"
		aria-expanded={isExpanded}
		onclick={toggleExpand}
		onkeydown={handleKeyDown}
	>
		<div class="category-header-content">
			<h2 class="category-title">{category.name}</h2>

			<div class="category-actions">
				<DeleteButton
					itemName={category.name}
					itemType="category"
					onDelete={handleDeleteCategory}
					small={true}
				/>
			</div>
		</div>

		<div class="category-controls">
			<div class="category-progress">
				<div class="progress-text">{completedItemsCount}/{totalItemsCount}</div>
				<div class="progress-bar-container">
					<div class="progress-bar" style="width: {progress}%"></div>
				</div>
			</div>

			<!-- Removed the onclick handler from the button to prevent event propagation issues -->
			<div class="expand-button-wrapper">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="chevron-icon"
					class:rotated={!isExpanded}
					aria-label={isExpanded ? 'Collapse category' : 'Expand category'}
				>
					<polyline points="6 9 12 15 18 9"></polyline>
				</svg>
			</div>
		</div>
	</div>

	{#if isExpanded}
		<div class="category-content" transition:slide={{ duration: 250, easing: cubicOut }}>
			{#if category.items.length === 0}
				<div class="empty-items">
					<p>No items in this category yet.</p>
				</div>
			{:else}
				<div class="checklist-items">
					{#each category.items as item, index}
						<div
							class="checklist-item-wrapper slide-in-right"
							style="animation-delay: {index * 50}ms"
						>
							<ChecklistItem
								{item}
								categoryId={category.id}
								{addChecklistItem}
								{toggleChecklistItemCompleted}
								deleteItem={handleDeleteItem}
								showAddSubItem={true}
							/>
						</div>
					{/each}
				</div>
			{/if}

			<div class="add-item-form">
				<AddItemForm
					placeholderText="Add new item to this category..."
					buttonText="Add Item"
					onSubmit={handleAddItem}
				/>
			</div>
		</div>
	{/if}
</div>

<style>
	.category-card {
		background-color: var(--color-surface);
		border-radius: var(--border-radius-lg);
		box-shadow: var(--shadow-md);
		overflow: hidden;
		transition:
			box-shadow var(--transition-duration-normal) var(--transition-timing-default),
			transform var(--transition-duration-normal) var(--transition-timing-default),
			background-color var(--transition-duration-normal) var(--transition-timing-default);
		width: 100%;
		min-width: 0; /* Ensure the card can shrink below its content size */
		max-width: 100%; /* Prevent overflow */
	}

	.category-card:hover {
		box-shadow: var(--shadow-lg);
		transform: translateY(-2px);
	}

	/* Active state for touch feedback */
	.category-card:active {
		transform: scale(0.99);
		box-shadow: var(--shadow-sm);
	}

	.category-header {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2);
		padding: var(--container-spacing);
		background-color: var(--color-light-header-bg);
		border-bottom: 1px solid var(--color-primary-200);
		cursor: pointer;
		transition: background-color var(--transition-duration-normal) var(--transition-timing-default);
		min-height: var(--touch-target-size); /* Ensure minimum touch target height */
		width: 100%;
	}

	.category-header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		min-width: 0; /* Ensure content can shrink */
	}

	.category-actions {
		/* Always visible for better UX */
		opacity: 1;
		transition: opacity var(--transition-duration-fast) var(--transition-timing-default);
		flex-shrink: 0; /* Prevent shrinking */
	}

	.category-title {
		font-size: var(--heading-h2-size);
		font-weight: var(--font-weight-bold);
		color: var(--color-primary-900);
		margin: 0;
		transition: color var(--transition-duration-normal) var(--transition-timing-default);
		word-break: break-word; /* Prevent overflow on small screens */
		overflow-wrap: break-word; /* Ensure long words break */
		hyphens: auto; /* Enable hyphenation */
		flex: 1;
		min-width: 0; /* Allow text to shrink */
		padding-right: var(--spacing-2); /* Space between text and actions */
	}

	.category-controls {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
		width: 100%;
		margin-top: var(--spacing-2);
		min-width: 0; /* Ensure controls can shrink */
	}

	.category-progress {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-1);
		flex: 1;
		margin-right: var(--spacing-2);
		min-width: 0; /* Ensure progress can shrink */
		width: 100%;
	}

	.progress-text {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		width: 100%;
		display: flex;
		justify-content: flex-end;
	}

	.progress-bar-container {
		width: 100%;
		height: clamp(6px, 1.5vw, 8px); /* Fluid height that scales with viewport */
		background-color: var(--color-neutral-200);
		border-radius: var(--border-radius-full);
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background-color: var(--color-primary-500);
		border-radius: var(--border-radius-full);
		transition: width var(--transition-duration-normal) var(--transition-timing-default);
	}

	.expand-button-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--touch-target-size); /* Fluid touch target size */
		height: var(--touch-target-size); /* Fluid touch target size */
		border-radius: var(--border-radius-full);
		background-color: transparent;
		color: var(--color-text-secondary);
		transition:
			background-color var(--transition-duration-fast) var(--transition-timing-default),
			color var(--transition-duration-fast) var(--transition-timing-default);
		touch-action: manipulation; /* Prevent double-tap zoom on mobile */
		flex-shrink: 0; /* Prevent shrinking */
	}

	.chevron-icon {
		transition: transform var(--transition-duration-normal) var(--transition-timing-default);
	}

	.rotated {
		transform: rotate(180deg);
	}

	.category-content {
		padding: var(--container-spacing);
		width: 100%;
		min-width: 0; /* Ensure content can shrink */
	}

	.checklist-items {
		margin-bottom: var(--spacing-4);
		width: 100%;
	}

	.checklist-item-wrapper {
		margin-bottom: var(--item-spacing);
		width: 100%;
	}

	.empty-items {
		padding: var(--spacing-4);
		text-align: center;
		color: var(--color-text-tertiary);
		font-style: italic;
		width: 100%;
	}

	.add-item-form {
		margin-top: var(--spacing-4);
		padding-top: var(--spacing-4);
		border-top: 1px solid var(--color-border);
		width: 100%;
	}

	/* Dark mode adjustments */
	:global([data-theme='dark']) .category-header {
		background-color: var(--color-dark-header-bg);
		border-bottom: 1px solid var(--color-primary-800);
	}

	:global([data-theme='dark']) .category-title {
		color: var(--color-primary-100); /* Even lighter color for better contrast */
	}

	:global([data-theme='dark']) .progress-text {
		color: var(--color-text-secondary); /* Improved contrast for progress text */
	}

	:global([data-theme='dark']) .progress-bar-container {
		background-color: var(--color-neutral-700); /* Darker background for progress bar */
	}

	:global([data-theme='dark']) .progress-bar {
		background-color: var(--color-primary-400); /* Brighter progress bar color */
	}

	:global([data-theme='dark']) .expand-button-wrapper {
		color: var(--color-neutral-300); /* Better visibility in dark mode */
	}

	:global([data-theme='dark']) .category-card:hover {
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
	}

	/* We're using a fluid design approach instead of fixed breakpoints */
	/* The component will automatically adapt to any screen width */
</style>
