<script lang="ts">
	import ConfirmationModal from './ConfirmationModal.svelte';

	// Props
	let {
		itemName = 'item',
		itemType = 'item',
		onDelete,
		small = false,
		ariaLabel
	} = $props<{
		itemName?: string;
		itemType?: string;
		onDelete: () => void;
		small?: boolean;
		ariaLabel?: string;
	}>();

	// State
	let isConfirmModalOpen = $state(false);
	let isDeleting = $state(false);

	// Computed
	const confirmationTitle = $derived(`Delete ${itemType}`);
	const confirmationMessage = $derived(
		`Are you sure you want to delete "${itemName}"? This action cannot be undone.`
	);
	const buttonAriaLabel = $derived(ariaLabel || `Delete ${itemName}`);

	// Methods
	function openConfirmModal() {
		isConfirmModalOpen = true;
	}

	function closeConfirmModal() {
		isConfirmModalOpen = false;
	}

	function handleDelete() {
		isDeleting = true;

		// Add a small delay to show the deleting state
		setTimeout(() => {
			onDelete();
			isDeleting = false;
			closeConfirmModal();
		}, 300);
	}
</script>

<button
	type="button"
	class="delete-button {small ? 'small' : ''} {isDeleting ? 'deleting' : ''}"
	onclick={openConfirmModal}
	aria-label={buttonAriaLabel}
	disabled={isDeleting}
>
	<span class="delete-icon">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={small ? 16 : 18}
			height={small ? 16 : 18}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M3 6h18"></path>
			<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
			<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
		</svg>
	</span>
	{#if !small}
		<span class="delete-text">Delete</span>
	{/if}
</button>

<ConfirmationModal
	isOpen={isConfirmModalOpen}
	title={confirmationTitle}
	message={confirmationMessage}
	confirmText={isDeleting ? 'Deleting...' : 'Delete'}
	confirmButtonType="danger"
	onConfirm={handleDelete}
	onCancel={closeConfirmModal}
/>

<style>
	.delete-button {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-2);
		padding: var(--spacing-2) var(--spacing-3);
		border-radius: var(--border-radius-md);
		background-color: transparent;
		color: var(--color-error-500);
		border: 1px solid var(--color-error-500);
		cursor: pointer;
		transition:
			background-color var(--transition-duration-fast) var(--transition-timing-default),
			color var(--transition-duration-fast) var(--transition-timing-default),
			transform var(--transition-duration-fast) var(--transition-timing-default);
		min-height: var(--touch-target-size); /* Fluid touch target height */
		min-width: var(--touch-target-size); /* Fluid touch target width */
		touch-action: manipulation; /* Prevent double-tap zoom on mobile */
		white-space: nowrap; /* Prevent text wrapping */
	}

	.delete-button:hover {
		background-color: var(--color-error-500);
		color: white;
		box-shadow: var(--shadow-sm);
	}

	/* Active state for touch feedback */
	.delete-button:active {
		transform: scale(0.95);
		background-color: var(--color-error-600);
		color: white;
	}

	/* Dark mode adjustments */
	:global([data-theme='dark']) .delete-button {
		border-color: var(--color-error-400);
		color: var(--color-error-400);
	}

	:global([data-theme='dark']) .delete-button:hover {
		background-color: var(--color-error-500);
		color: white;
		border-color: var(--color-error-500);
	}

	.delete-button.small {
		padding: var(--spacing-2) var(--spacing-2);
		font-size: var(--font-size-sm);
		min-height: clamp(2rem, 8vw, 2.5rem); /* Fluid height that scales with viewport */
		min-width: clamp(2rem, 8vw, 2.5rem); /* Fluid width that scales with viewport */
	}

	.delete-button.deleting {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.delete-icon {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.delete-text {
		font-weight: var(--font-weight-medium);
	}

	/* Animation for deleting state */
	.deleting .delete-icon {
		animation: pulse 1s infinite;
	}

	/* We're using a fluid design approach instead of fixed breakpoints */
	/* The component will automatically adapt to any screen width */
</style>
