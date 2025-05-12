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

<div class="flex items-center gap-2 py-2">
	<input
		type="checkbox"
		checked={todo.completed}
		onchange={handleToggleCompleted}
		class="h-5 w-5"
	/>
	<span class={todo.completed ? 'text-gray-500 line-through' : ''}>
		{todo.text}
	</span>
</div>
