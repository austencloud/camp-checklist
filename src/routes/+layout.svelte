<script lang="ts">
	import '../app.css';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let { children } = $props();
</script>

<div class="app-container">
	<div class="theme-toggle-container">
		<ThemeToggle />
	</div>
	{@render children()}
</div>

<style>
	.app-container {
		position: relative;
		min-height: 100vh;
	}

	.theme-toggle-container {
		position: fixed;
		top: var(--spacing-4);
		right: var(--spacing-4);
		z-index: var(--z-index-sticky);
	}
</style>
