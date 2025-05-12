<script lang="ts">
	import type { Category as CategoryType } from '../types.js';
	import Category from './Category.svelte';
	import AddItemForm from './AddItemForm.svelte';

	// Props
	let {
		categories,
		addCategory,
		addChecklistItem,
		toggleChecklistItemCompleted,
		deleteCategory,
		deleteChecklistItem,
		reorderChecklistItems
	} = $props<{
		categories: CategoryType[];
		addCategory: (name: string) => void;
		addChecklistItem: (categoryId: string, text: string, parentItemId?: string) => void;
		toggleChecklistItemCompleted: (itemId: string) => void;
		deleteCategory: (categoryId: string) => void;
		deleteChecklistItem: (categoryId: string, itemId: string, parentItemId?: string) => void;
		reorderChecklistItems: (categoryId: string, oldIndex: number, newIndex: number) => void;
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
					<Category
						{category}
						{addChecklistItem}
						{toggleChecklistItemCompleted}
						{deleteCategory}
						{deleteChecklistItem}
						{reorderChecklistItems}
					/>
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
		margin-top: var(--spacing-4); /* Reduced for mobile */
	}

	.category-list-header {
		margin-bottom: var(--spacing-4); /* Reduced for mobile */
		padding-bottom: var(--spacing-2); /* Reduced for mobile */
		border-bottom: 1px solid var(--color-border);
	}

	.category-list-title {
		font-size: var(--mobile-h2-size); /* Mobile-optimized heading size */
		font-weight: var(--font-weight-bold);
		color: var(--color-primary-700);
		transition: color var(--transition-duration-normal) var(--transition-timing-default);
		text-align: center; /* Center align on mobile */
	}

	.category-grid {
		display: grid;
		grid-template-columns: 1fr; /* Single column on mobile */
		gap: var(--mobile-item-spacing); /* Mobile-optimized spacing */
		margin-bottom: var(--spacing-4); /* Reduced for mobile */
		width: 100%;
		max-width: 100%; /* Prevent overflow */
		box-sizing: border-box; /* Include padding in width calculation */
	}

	.category-item {
		width: 100%;
		max-width: 100%;
		box-sizing: border-box;
	}

	.category-form {
		max-width: 100%; /* Full width on mobile */
		margin-top: var(--spacing-4); /* Reduced for mobile */
		padding: var(--spacing-3); /* Reduced for mobile */
		background-color: var(--color-surface);
		border-radius: var(--border-radius-lg);
		box-shadow: var(--shadow-md);
		transition: background-color var(--transition-duration-normal) var(--transition-timing-default);
	}

	.empty-categories {
		grid-column: 1 / -1;
		padding: var(--spacing-6); /* Reduced for mobile */
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
	@media (min-width: 480px) {
		.category-form {
			padding: var(--spacing-4);
		}
	}

	@media (min-width: 640px) {
		.category-list-section {
			margin-top: var(--spacing-6);
		}

		.category-list-header {
			margin-bottom: var(--spacing-6);
			padding-bottom: var(--spacing-3);
		}

		.category-list-title {
			font-size: var(--font-size-2xl);
			text-align: left;
		}

		.category-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: var(--spacing-6);
			margin-bottom: var(--spacing-6);
		}

		.category-form {
			max-width: 500px;
			margin-top: var(--spacing-6);
		}
	}

	@media (min-width: 1024px) {
		.category-grid {
			grid-template-columns: repeat(3, 1fr);
		}

		.category-list-section {
			margin-top: var(--spacing-8);
		}
	}
</style>
