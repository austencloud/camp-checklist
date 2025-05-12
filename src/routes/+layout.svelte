<script lang="ts">
	// Import CSS with high priority to ensure it's loaded early
	import '../app.css';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	// Enable transitions after initial render to prevent FOUC
	onMount(() => {
		// Small delay to ensure the page is fully rendered
		setTimeout(() => {
			document.documentElement.classList.add('transitions-enabled');
		}, 50);
	});
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
		top: clamp(0.5rem, 2vw, 1rem); /* Fluid spacing that scales with viewport */
		right: clamp(0.5rem, 2vw, 1rem); /* Fluid spacing that scales with viewport */
		z-index: var(--z-index-sticky);
	}

	/* We're using a fluid design approach instead of fixed breakpoints */
	/* The component will automatically adapt to any screen width */
</style>
