<script lang="ts">
	import CategoryList from '$lib/components/CategoryList.svelte';
	import TodoList from '$lib/components/TodoList.svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<header class="mb-8 text-center">
		<h1 class="mb-2 text-3xl font-bold text-blue-900">Kinetic Fire Festival - Camping Checklist</h1>
		<p class="text-gray-600">Keep track of your camping gear and to-dos for the festival</p>
	</header>

	<main>
		<TodoList />
		<CategoryList />
	</main>

	<footer class="mt-12 border-t pt-6 text-center text-sm text-gray-500">
		<p>Built with Svelte 5 and ❤️</p>
	</footer>
</div>
