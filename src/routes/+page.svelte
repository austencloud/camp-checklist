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

<div class="container mx-auto px-4 py-8">
	<header class="mb-8 text-center">
		<h1 class="mb-2 text-3xl font-bold text-blue-900">Kinetic Fire Festival - Camping Checklist</h1>
		<p class="text-gray-600">Keep track of your camping gear and to-dos for the festival</p>
	</header>

	<main>
		<TodoList {todoItems} {toggleTodoItemCompleted} {addTodoItem} />
		<CategoryList {categories} {addCategory} {addChecklistItem} {toggleChecklistItemCompleted} />
	</main>

	<footer class="mt-12 border-t pt-6 text-center text-sm text-gray-500">
		<p>Built with Svelte 5 and ❤️</p>
	</footer>
</div>
