<script lang="ts">
	import type { Category, ChecklistItem as ChecklistItemType } from '../types.js';
	import ChecklistItem from './ChecklistItem.svelte';
	import AddItemForm from './AddItemForm.svelte';
	import { slide } from 'svelte/transition';

	// Props
	let { category, addChecklistItem, toggleChecklistItemCompleted } = $props<{
		category: Category;
		addChecklistItem: (categoryId: string, text: string, parentItemId?: string) => void;
		toggleChecklistItemCompleted: (itemId: string) => void;
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
		<h2 class="category-title">{category.name}</h2>

		<div class="category-controls">
			<div class="category-progress">
				<div class="progress-text">{completedItemsCount}/{totalItemsCount}</div>
				<div class="progress-bar-container">
					<div class="progress-bar" style="width: {progress}%"></div>
				</div>
			</div>

			<button
				class="expand-button"
				aria-label={isExpanded ? 'Collapse category' : 'Expand category'}
				onclick={toggleExpand}
			>
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
				>
					<polyline points="6 9 12 15 18 9"></polyline>
				</svg>
			</button>
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
	}

	.category-card:hover {
		box-shadow: var(--shadow-lg);
		transform: translateY(-2px);
	}

	.category-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-4);
		background-color: var(--color-primary-50);
		border-bottom: 1px solid var(--color-border);
		cursor: pointer;
		transition: background-color var(--transition-duration-normal) var(--transition-timing-default);
	}

	.category-title {
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-bold);
		color: var(--color-primary-700);
		margin: 0;
		transition: color var(--transition-duration-normal) var(--transition-timing-default);
	}

	.category-controls {
		display: flex;
		align-items: center;
		gap: var(--spacing-3);
	}

	.category-progress {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: var(--spacing-1);
	}

	.progress-text {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
	}

	.progress-bar-container {
		width: 80px;
		height: 6px;
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

	.expand-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: var(--border-radius-full);
		background-color: transparent;
		border: none;
		color: var(--color-text-secondary);
		transition:
			background-color var(--transition-duration-fast) var(--transition-timing-default),
			color var(--transition-duration-fast) var(--transition-timing-default);
	}

	.expand-button:hover {
		background-color: var(--color-neutral-200);
		color: var(--color-text-primary);
	}

	.chevron-icon {
		transition: transform var(--transition-duration-normal) var(--transition-timing-default);
	}

	.rotated {
		transform: rotate(180deg);
	}

	.category-content {
		padding: var(--spacing-4);
	}

	.checklist-items {
		margin-bottom: var(--spacing-4);
	}

	.checklist-item-wrapper {
		margin-bottom: var(--spacing-1);
	}

	.empty-items {
		padding: var(--spacing-4);
		text-align: center;
		color: var(--color-text-tertiary);
		font-style: italic;
	}

	.add-item-form {
		margin-top: var(--spacing-4);
		padding-top: var(--spacing-4);
		border-top: 1px solid var(--color-border);
	}

	/* Dark mode adjustments */
	:global([data-theme='dark']) .category-header {
		background-color: var(--color-primary-950);
	}

	:global([data-theme='dark']) .category-title {
		color: var(--color-primary-300);
	}

	:global([data-theme='dark']) .expand-button:hover {
		background-color: var(--color-neutral-700);
	}
</style>
