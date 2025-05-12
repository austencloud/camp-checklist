<script lang="ts">
	import { todoItems, addTodoItem } from '../store.svelte';
	import TodoItem from './TodoItem.svelte';
	import AddItemForm from './AddItemForm.svelte';

	// Methods
	function handleAddTodo(text: string) {
		addTodoItem(text);
	}
</script>

<div class="mb-6 rounded-lg bg-white p-4 shadow-md">
	<h2 class="mb-3 text-xl font-bold text-blue-700">To-Do List</h2>

	<div class="space-y-1">
		{#each todoItems as todo}
			<TodoItem {todo} />
		{/each}
	</div>

	<div class="mt-4">
		<AddItemForm placeholderText="Add new to-do item..." onSubmit={handleAddTodo} />
	</div>
</div>
