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

<section class="category-list-section">
	<div class="category-list-header">
		<h2 class="category-list-title">Categories</h2>
	</div>

	<div class="category-grid">
		{#if categories.length === 0}
			<div class="empty-categories">
				<p>No categories yet. Add your first one below!</p>
			</div>
		{:else}
			{#each categories as category, index}
				<div class="category-item scale-in" style="animation-delay: {index * 75}ms">
					<Category {category} {addChecklistItem} {toggleChecklistItemCompleted} />
				</div>
			{/each}
		{/if}
	</div>

	<div class="category-form">
		<AddItemForm
			placeholderText="Add new category..."
			buttonText="Add Category"
			onSubmit={handleAddCategory}
		/>
	</div>
</section>

<style>
	.category-list-section {
		margin-top: var(--spacing-8);
	}

	.category-list-header {
		margin-bottom: var(--spacing-6);
		padding-bottom: var(--spacing-3);
		border-bottom: 1px solid var(--color-border);
	}

	.category-list-title {
		font-size: var(--font-size-2xl);
		font-weight: var(--font-weight-bold);
		color: var(--color-primary-700);
		transition: color var(--transition-duration-normal) var(--transition-timing-default);
	}

	.category-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-6);
		margin-bottom: var(--spacing-6);
	}

	.category-form {
		max-width: 500px;
		margin-top: var(--spacing-8);
		padding: var(--spacing-4);
		background-color: var(--color-surface);
		border-radius: var(--border-radius-lg);
		box-shadow: var(--shadow-md);
		transition: background-color var(--transition-duration-normal) var(--transition-timing-default);
	}

	.empty-categories {
		grid-column: 1 / -1;
		padding: var(--spacing-8);
		text-align: center;
		color: var(--color-text-tertiary);
		background-color: var(--color-surface);
		border-radius: var(--border-radius-lg);
		border: 2px dashed var(--color-border);
	}

	/* Dark mode adjustments */
	:global([data-theme='dark']) .category-list-title {
		color: var(--color-primary-300);
	}

	/* Responsive adjustments */
	@media (min-width: 640px) {
		.category-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.category-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
