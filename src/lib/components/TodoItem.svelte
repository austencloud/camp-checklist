<script lang="ts">
	import type { TodoItem } from '../types.js';

	// Props
	let { todo, toggleTodoItemCompleted } = $props<{
		todo: TodoItem;
		toggleTodoItemCompleted: (id: string) => void;
	}>();

	function handleToggleCompleted() {
		toggleTodoItemCompleted(todo.id);
	}
</script>

<div class="todo-item">
	<label class="todo-item-label">
		<input
			type="checkbox"
			checked={todo.completed}
			onchange={handleToggleCompleted}
			class={todo.completed ? 'checkbox-checked' : ''}
		/>
		<span class="todo-text" class:completed={todo.completed}>
			{todo.text}
		</span>
	</label>
</div>

<style>
	.todo-item {
		padding: var(--spacing-2) 0;
		transition: background-color var(--transition-duration-fast) var(--transition-timing-default);
		border-radius: var(--border-radius-md);
	}

	.todo-item:hover {
		background-color: var(--color-neutral-100);
	}

	.todo-item-label {
		display: flex;
		align-items: center;
		gap: var(--spacing-3);
		cursor: pointer;
		padding: var(--spacing-1) var(--spacing-2);
		width: 100%;
	}

	.todo-text {
		transition:
			color var(--transition-duration-normal) var(--transition-timing-default),
			text-decoration var(--transition-duration-normal) var(--transition-timing-default);
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
		background-color: var(--color-neutral-800);
	}
</style>
