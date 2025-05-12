<script lang="ts">
	import type { TodoItem as TodoItemType } from '../types.js';
	import TodoItem from './TodoItem.svelte';
	import AddItemForm from './AddItemForm.svelte';

	// Props
	let { todoItems, toggleTodoItemCompleted, addTodoItem } = $props<{
		todoItems: TodoItemType[];
		toggleTodoItemCompleted: (id: string) => void;
		addTodoItem: (text: string) => void;
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
					<TodoItem {todo} {toggleTodoItemCompleted} />
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
	}

	.todo-list-container:hover {
		box-shadow: var(--shadow-lg);
	}

	.todo-list-header {
		padding: var(--spacing-4);
		border-bottom: 1px solid var(--color-border);
		background-color: var(--color-primary-50);
		transition: background-color var(--transition-duration-normal) var(--transition-timing-default);
	}

	.todo-list-title {
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-bold);
		color: var(--color-primary-700);
		transition: color var(--transition-duration-normal) var(--transition-timing-default);
	}

	.todo-items {
		padding: var(--spacing-4);
		min-height: 100px;
	}

	.todo-item-wrapper {
		margin-bottom: var(--spacing-2);
	}

	.todo-item-wrapper:last-child {
		margin-bottom: 0;
	}

	.todo-form {
		padding: var(--spacing-4);
		border-top: 1px solid var(--color-border);
		background-color: var(--color-surface-elevated);
		transition: background-color var(--transition-duration-normal) var(--transition-timing-default);
	}

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
		background-color: var(--color-primary-950);
	}

	:global([data-theme='dark']) .todo-list-title {
		color: var(--color-primary-300);
	}
</style>
