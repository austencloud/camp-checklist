<script lang="ts">
	import type { TodoItem as TodoItemType } from '../types.js';
	import TodoItem from './TodoItem.svelte';
	import AddItemForm from './AddItemForm.svelte';

	// Props
	let { todoItems, toggleTodoItemCompleted, addTodoItem, deleteTodoItem } = $props<{
		todoItems: TodoItemType[];
		toggleTodoItemCompleted: (id: string) => void;
		addTodoItem: (text: string) => void;
		deleteTodoItem: (id: string) => void;
	}>();

	// Methods
	function handleAddTodo(text: string) {
		addTodoItem(text);
	}
</script>

<div class="todo-list-container">
	<div class="todo-list-header">
		<h2 class="todo-list-title">To-Do List</h2>
	</div>

	<div class="todo-items">
		{#if todoItems.length === 0}
			<div class="empty-state">
				<p>No to-do items yet. Add your first one below!</p>
			</div>
		{:else}
			{#each todoItems as todo, index}
				<div class="todo-item-wrapper slide-in-right" style="animation-delay: {index * 50}ms">
					<TodoItem {todo} {toggleTodoItemCompleted} {deleteTodoItem} />
				</div>
			{/each}
		{/if}
	</div>

	<div class="todo-form">
		<AddItemForm
			placeholderText="Add new to-do item..."
			buttonText="Add Task"
			onSubmit={handleAddTodo}
		/>
	</div>
</div>

<style>
	.todo-list-container {
		background-color: var(--color-surface);
		border-radius: var(--border-radius-lg);
		box-shadow: var(--shadow-md);
		overflow: hidden;
		transition:
			background-color var(--transition-duration-normal) var(--transition-timing-default),
			box-shadow var(--transition-duration-normal) var(--transition-timing-default);
		width: 100%;
		max-width: 100%; /* Prevent overflow */
		box-sizing: border-box; /* Include padding in width calculation */
		min-width: 0; /* Ensure the container can shrink below its content size */
	}

	.todo-list-container:hover {
		box-shadow: var(--shadow-lg);
	}

	.todo-list-header {
		padding: var(--container-spacing);
		border-bottom: 1px solid var(--color-primary-200);
		background-color: var(--color-light-header-bg);
		transition: background-color var(--transition-duration-normal) var(--transition-timing-default);
		width: 100%;
	}

	.todo-list-title {
		font-size: var(--heading-h2-size);
		font-weight: var(--font-weight-bold);
		color: var(--color-primary-900);
		transition: color var(--transition-duration-normal) var(--transition-timing-default);
		text-align: center;
		word-break: break-word; /* Ensure text wraps properly on narrow screens */
		hyphens: auto; /* Enable hyphenation for very long words */
	}

	.todo-items {
		padding: var(--container-spacing);
		min-height: 100px;
		width: 100%;
	}

	.todo-item-wrapper {
		margin-bottom: var(--item-spacing);
		width: 100%;
	}

	.todo-item-wrapper:last-child {
		margin-bottom: 0;
	}

	.todo-form {
		padding: var(--container-spacing);
		border-top: 1px solid var(--color-border);
		background-color: var(--color-surface-elevated);
		transition: background-color var(--transition-duration-normal) var(--transition-timing-default);
		width: 100%;
	}

	/* Empty state styling */
	.empty-state {
		text-align: center;
		padding: var(--spacing-6);
		color: var(--color-text-tertiary);
	}

	/* We're using a fluid design approach instead of fixed breakpoints */
	/* The component will automatically adapt to any screen width */

	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100px;
		color: var(--color-text-tertiary);
		font-style: italic;
		text-align: center;
	}

	/* Dark mode adjustments */
	:global([data-theme='dark']) .todo-list-header {
		background-color: var(--color-dark-header-bg);
		border-bottom: 1px solid var(--color-primary-800);
	}

	:global([data-theme='dark']) .todo-list-title {
		color: var(--color-primary-100); /* Even lighter color for better contrast */
	}

	:global([data-theme='dark']) .todo-form {
		background-color: var(--color-neutral-800); /* Slightly darker background */
		border-top: 1px solid var(--color-neutral-700);
	}

	:global([data-theme='dark']) .empty-state {
		color: var(--color-text-secondary); /* Improved contrast for empty state text */
	}

	:global([data-theme='dark']) .todo-list-container:hover {
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
	}
</style>
