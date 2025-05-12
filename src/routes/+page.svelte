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

	function addTodoItem(text: string) {
		todoItems.push({ id: uuidv4(), text, completed: false });
	}

	function toggleTodoItemCompleted(id: string) {
		const todo = todoItems.find((t) => t.id === id);
		if (todo) {
			todo.completed = !todo.completed;
		}
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
		<TodoList {todoItems} {toggleTodoItemCompleted} {addTodoItem} />
		<CategoryList {categories} {addCategory} {addChecklistItem} {toggleChecklistItemCompleted} />
	</main>

	<footer class="app-footer">
		<p>Built with Svelte 5 and ❤️</p>
	</footer>
</div>

<style>
	.app-layout {
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--spacing-4);
	}

	.app-header {
		margin-bottom: var(--spacing-8);
		padding: var(--spacing-6) var(--spacing-4);
		background-color: var(--color-surface-elevated);
		border-radius: var(--border-radius-lg);
		box-shadow: var(--shadow-md);
		transition: background-color var(--transition-duration-normal) var(--transition-timing-default);
	}

	.header-content {
		text-align: center;
	}

	.app-title {
		font-size: var(--font-size-3xl);
		font-weight: var(--font-weight-bold);
		color: var(--color-primary-700);
		margin-bottom: var(--spacing-2);
		transition: color var(--transition-duration-normal) var(--transition-timing-default);
	}

	.app-subtitle {
		color: var(--color-text-secondary);
		font-size: var(--font-size-lg);
	}

	.app-main {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-6);
	}

	.app-footer {
		margin-top: var(--spacing-12);
		padding-top: var(--spacing-6);
		border-top: 1px solid var(--color-border);
		text-align: center;
		color: var(--color-text-tertiary);
		font-size: var(--font-size-sm);
	}

	/* Responsive adjustments */
	@media (min-width: 768px) {
		.app-layout {
			padding: var(--spacing-6);
		}

		.app-header {
			padding: var(--spacing-8) var(--spacing-6);
		}

		.app-title {
			font-size: var(--font-size-4xl);
		}
	}
</style>
