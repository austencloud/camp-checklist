<script lang="ts">
	import type { TodoItem } from '../types';
	import { toggleTodoItemCompleted } from '../store.svelte';

	// Props
	let { todo } = $props<{
		todo: TodoItem;
	}>();
</script>

<div class="flex items-center gap-2 py-2">
	<input
		type="checkbox"
		checked={todo.completed}
		on:change={() => toggleTodoItemCompleted(todo.id)}
		class="h-5 w-5"
	/>
	<span class={todo.completed ? 'text-gray-500 line-through' : ''}>
		{todo.text}
	</span>
</div>
