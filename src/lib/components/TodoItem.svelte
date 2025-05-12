<script lang="ts">
	import type { TodoItem } from '../types.js';
	import DeleteButton from './DeleteButton.svelte';

	// Props
	let { todo, toggleTodoItemCompleted, deleteTodoItem } = $props<{
		todo: TodoItem;
		toggleTodoItemCompleted: (id: string) => void;
		deleteTodoItem: (id: string) => void;
	}>();

	function handleToggleCompleted() {
		toggleTodoItemCompleted(todo.id);
	}

	function handleDelete() {
		deleteTodoItem(todo.id);
	}
</script>

<div class="todo-item">
	<div class="todo-item-content">
		<label class="todo-item-label">
			<input
				type="checkbox"
				checked={todo.completed}
				onchange={handleToggleCompleted}
				class={todo.completed ? 'checkbox-checked' : ''}
				aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
			/>
			<span class="todo-text" class:completed={todo.completed}>
				{todo.text}
			</span>
		</label>

		<div class="todo-item-actions">
			<DeleteButton
				itemName={todo.text}
				itemType="to-do item"
				onDelete={handleDelete}
				small={true}
			/>
		</div>
	</div>
</div>

<style>
	.todo-item {
		padding: var(--spacing-3) 0;
		transition: background-color var(--transition-duration-fast) var(--transition-timing-default);
		border-radius: var(--border-radius-md);
		margin-bottom: var(--item-spacing);
		width: 100%;
		min-width: 0; /* Ensure the item can shrink */
	}

	.todo-item:hover {
		background-color: var(--color-light-hover-bg);
		color: var(--color-light-hover-text);
	}

	/* Active state for touch feedback */
	.todo-item:active {
		background-color: var(--color-primary-50);
	}

	.todo-item-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-2) var(--container-spacing);
		min-height: var(--touch-target-size);
		width: 100%;
		min-width: 0; /* Ensure content can shrink */
	}

	.todo-item-label {
		display: flex;
		align-items: center;
		gap: var(--spacing-3);
		cursor: pointer;
		flex: 1;
		min-height: var(--touch-target-size);
		padding: var(--spacing-1) 0;
		min-width: 0; /* Ensure label can shrink */
		word-break: break-word; /* Ensure text wraps properly */
	}

	.todo-item-actions {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
		opacity: 1; /* Always visible for better UX */
		transition: opacity var(--transition-duration-fast) var(--transition-timing-default);
		flex-shrink: 0; /* Prevent shrinking */
	}

	.todo-text {
		transition:
			color var(--transition-duration-normal) var(--transition-timing-default),
			text-decoration var(--transition-duration-normal) var(--transition-timing-default);
		word-break: break-word; /* Ensure text wraps properly */
		overflow-wrap: break-word; /* Ensure long words break */
		hyphens: auto; /* Enable hyphenation */
		min-width: 0; /* Allow text to shrink */
	}

	.completed {
		color: var(--color-text-tertiary);
		text-decoration: line-through;
	}

	.checkbox-checked::after {
		animation: checkbox-check var(--transition-duration-normal) var(--transition-timing-out)
			forwards;
	}

	/* Dark mode adjustments */
	:global([data-theme='dark']) .todo-item:hover {
		background-color: var(--color-dark-hover-bg); /* Using our new custom hover color */
		color: var(--color-dark-hover-text); /* Ensuring text is visible on hover */
	}

	:global([data-theme='dark']) .completed {
		color: var(--color-text-tertiary);
		text-decoration: line-through;
		opacity: 0.8; /* Slightly more visible than default */
	}

	:global([data-theme='dark']) .todo-text {
		color: var(--color-text-primary); /* Ensuring good contrast for text */
	}
</style>
