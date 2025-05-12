<script lang="ts">
	import CategoryList from '$lib/components/CategoryList.svelte';
	import TodoList from '$lib/components/TodoList.svelte';
	import type { Category, ChecklistItem, TodoItem } from '$lib/types.js';
	import { v4 as uuidv4 } from 'uuid';
	import {
		initialCategories,
		initialTodoItems,
		findChecklistItemRecursive,
		toggleSubItems,
		loadFromLocalStorage,
		saveToLocalStorage
	} from '$lib/initialData.js';

	// --- State Management ---
	const categories = $state<Category[]>([...initialCategories]);
	const todoItems = $state<TodoItem[]>([...initialTodoItems]);

	// --- Load from localStorage on component initialization ---
	const { loadedCategories, loadedTodoItems } = loadFromLocalStorage();
	if (loadedCategories) {
		categories.length = 0;
		categories.push(...loadedCategories);
	}
	if (loadedTodoItems) {
		todoItems.length = 0;
		todoItems.push(...loadedTodoItems);
	}

	// --- Save to localStorage whenever state changes ---
	$effect(() => {
		saveToLocalStorage(categories, todoItems);
	});

	// --- Functions to manipulate state ---
	function addChecklistItem(categoryId: string, text: string, parentItemId?: string) {
		const newItem: ChecklistItem = { id: uuidv4(), text, completed: false };
		const category = categories.find((cat) => cat.id === categoryId);
		if (category) {
			if (parentItemId) {
				const parentItem = findChecklistItemRecursive(category.items, parentItemId);
				if (parentItem) {
					if (!parentItem.subItems) {
						parentItem.subItems = [];
					}
					parentItem.subItems.push(newItem);
				}
			} else {
				category.items.push(newItem);
			}
		}
	}

	function toggleChecklistItemCompleted(itemId: string) {
		for (const category of categories) {
			const item = findChecklistItemRecursive(category.items, itemId);
			if (item) {
				item.completed = !item.completed;
				// If it's a parent item, toggle its sub-items
				if (item.subItems) {
					toggleSubItems(item.subItems, item.completed);
				}
				return;
			}
		}
	}

	function addCategory(name: string) {
		categories.push({ id: uuidv4(), name, items: [] });
	}

	function deleteCategory(categoryId: string) {
		const index = categories.findIndex((cat) => cat.id === categoryId);
		if (index !== -1) {
			categories.splice(index, 1);
		}
	}

	function deleteChecklistItem(categoryId: string, itemId: string, parentItemId?: string) {
		const category = categories.find((cat) => cat.id === categoryId);
		if (!category) return;

		// If we have a parent item ID, we need to delete from the parent's subItems
		if (parentItemId) {
			const parentItem = findChecklistItemRecursive(category.items, parentItemId);
			if (parentItem && parentItem.subItems) {
				const subItemIndex = parentItem.subItems.findIndex((item) => item.id === itemId);
				if (subItemIndex !== -1) {
					parentItem.subItems.splice(subItemIndex, 1);
					// If no more subitems, remove the subItems array
					if (parentItem.subItems.length === 0) {
						delete parentItem.subItems;
					}
				}
			}
		} else {
			// Delete from the category's items
			const itemIndex = category.items.findIndex((item) => item.id === itemId);
			if (itemIndex !== -1) {
				category.items.splice(itemIndex, 1);
			}
		}
	}

	// Helper function to find the parent item of a checklist item
	function findParentItem(
		categoryId: string,
		itemId: string
	): { parentItem: ChecklistItem | null; category: Category | null } {
		const category = categories.find((cat) => cat.id === categoryId);
		if (!category) return { parentItem: null, category: null };

		for (const item of category.items) {
			if (item.subItems) {
				const subItemIndex = item.subItems.findIndex((subItem) => subItem.id === itemId);
				if (subItemIndex !== -1) {
					return { parentItem: item, category };
				}

				// Recursively check nested subitems (if needed in the future)
				// This implementation assumes only one level of nesting for simplicity
			}
		}

		return { parentItem: null, category };
	}

	function addTodoItem(text: string) {
		todoItems.push({ id: uuidv4(), text, completed: false });
	}

	function deleteTodoItem(id: string) {
		const index = todoItems.findIndex((todo) => todo.id === id);
		if (index !== -1) {
			todoItems.splice(index, 1);
		}
	}

	function toggleTodoItemCompleted(id: string) {
		const todo = todoItems.find((t) => t.id === id);
		if (todo) {
			todo.completed = !todo.completed;
		}
	}

	// Function to reorder checklist items within a category
	function reorderChecklistItems(categoryId: string, oldIndex: number, newIndex: number) {
		const category = categories.find((cat) => cat.id === categoryId);
		if (!category) return;

		// Get the item to move
		const itemToMove = category.items[oldIndex];
		if (!itemToMove) return;

		// Remove the item from its old position
		category.items.splice(oldIndex, 1);

		// Insert the item at its new position
		category.items.splice(newIndex, 0, itemToMove);

		// The effect will automatically save to localStorage
	}
</script>

<div class="app-layout">
	<header class="app-header">
		<div class="header-content">
			<h1 class="app-title">Kinetic Fire Festival - Camping Checklist</h1>
			<p class="app-subtitle">Keep track of your camping gear and to-dos for the festival</p>
		</div>
	</header>

	<main class="app-main">
		<TodoList {todoItems} {toggleTodoItemCompleted} {addTodoItem} {deleteTodoItem} />
		<CategoryList
			{categories}
			{addCategory}
			{addChecklistItem}
			{toggleChecklistItemCompleted}
			{deleteCategory}
			{deleteChecklistItem}
			{reorderChecklistItems}
		/>
	</main>

	<footer class="app-footer">
		<p>Built with Svelte 5 and ❤️</p>
	</footer>
</div>

<style>
	.app-layout {
		max-width: var(--container-max-width);
		margin: 0 auto;
		padding: var(--container-spacing);
		width: var(--container-width-narrow); /* Fluid width that works on all screens */
		box-sizing: border-box;
		overflow-x: hidden; /* Prevent horizontal scrolling */
		min-width: 0; /* Ensure the container can shrink below its content size */
	}

	.app-header {
		margin-bottom: var(--spacing-4);
		padding: var(--container-spacing);
		background-color: var(--color-surface-elevated);
		border-radius: var(--border-radius-lg);
		box-shadow: var(--shadow-md);
		transition: background-color var(--transition-duration-normal) var(--transition-timing-default);
		width: 100%;
		min-width: 0; /* Ensure the header can shrink below its content size */
	}

	.header-content {
		text-align: center;
		width: 100%;
	}

	.app-title {
		font-size: var(--heading-h1-size);
		font-weight: var(--font-weight-bold);
		color: var(--color-primary-700);
		margin-bottom: var(--spacing-2);
		transition: color var(--transition-duration-normal) var(--transition-timing-default);
		line-height: 1.3;
		word-break: break-word; /* Ensure text wraps properly on narrow screens */
		hyphens: auto; /* Enable hyphenation for very long words */
	}

	.app-subtitle {
		color: var(--color-text-secondary);
		font-size: var(--font-size-base);
		padding: 0;
		width: 100%;
		word-break: break-word; /* Ensure text wraps properly on narrow screens */
	}

	.app-main {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--item-spacing);
		width: 100%;
		min-width: 0; /* Ensure the main content can shrink below its content size */
	}

	.app-footer {
		margin-top: var(--spacing-8);
		padding-top: var(--spacing-4);
		border-top: 1px solid var(--color-border);
		text-align: center;
		color: var(--color-text-tertiary);
		font-size: var(--font-size-sm);
		width: 100%;
	}

	/* We're using a fluid design approach instead of fixed breakpoints */
	/* The layout will automatically adapt to any screen width */
	/* This ensures proper display on ultra-narrow screens like folding phones */
</style>
