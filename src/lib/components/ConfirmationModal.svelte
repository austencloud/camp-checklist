<script lang="ts">
	// Props
	let {
		isOpen,
		title,
		message,
		confirmText = 'Confirm',
		cancelText = 'Cancel',
		confirmButtonType = 'danger',
		onConfirm,
		onCancel
	} = $props<{
		isOpen: boolean;
		title: string;
		message: string;
		confirmText?: string;
		cancelText?: string;
		confirmButtonType?: 'primary' | 'danger';
		onConfirm: () => void;
		onCancel: () => void;
	}>();

	// Handle keyboard events for accessibility
	function handleKeyDown(e: KeyboardEvent) {
		if (!isOpen) return;

		if (e.key === 'Escape') {
			onCancel();
		}
	}

	// Focus trap for accessibility
	let modalElement = $state<HTMLDivElement>();
	let focusableElements: HTMLElement[];
	let firstFocusableElement: HTMLElement;
	let lastFocusableElement: HTMLElement;

	$effect(() => {
		if (isOpen && modalElement) {
			// Set focus to the modal
			setTimeout(() => {
				if (modalElement) modalElement.focus();

				// Get all focusable elements
				if (modalElement) {
					focusableElements = Array.from(
						modalElement.querySelectorAll(
							'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
						)
					) as HTMLElement[];

					firstFocusableElement = focusableElements[0];
					lastFocusableElement = focusableElements[focusableElements.length - 1];
				}
			}, 50);
		}
	});

	function handleTabKey(e: KeyboardEvent) {
		if (e.key !== 'Tab') return;

		// If shift + tab on first element, move to last element
		if (e.shiftKey && document.activeElement === firstFocusableElement) {
			e.preventDefault();
			lastFocusableElement.focus();
		}
		// If tab on last element, move to first element
		else if (!e.shiftKey && document.activeElement === lastFocusableElement) {
			e.preventDefault();
			firstFocusableElement.focus();
		}
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

{#if isOpen}
	<div class="modal-backdrop" onclick={onCancel} aria-hidden="true"></div>

	<div
		class="modal-container"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
		bind:this={modalElement}
		onkeydown={handleTabKey}
	>
		<div class="modal-content">
			<div class="modal-header">
				<h2 id="modal-title" class="modal-title">{title}</h2>
				<button type="button" class="close-button" aria-label="Close modal" onclick={onCancel}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>

			<div class="modal-body">
				<p>{message}</p>
			</div>

			<div class="modal-footer">
				<button type="button" class="cancel-button" onclick={onCancel}>
					{cancelText}
				</button>
				<button type="button" class="confirm-button {confirmButtonType}" onclick={onConfirm}>
					{confirmText}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(2px);
		z-index: var(--z-index-modal);
		animation: fade-in var(--transition-duration-fast) var(--transition-timing-out);
	}

	.modal-container {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: calc(var(--z-index-modal) + 1);
		width: 90%;
		max-width: 500px;
		outline: none;
		animation: scale-in var(--transition-duration-normal) var(--transition-timing-out);
	}

	.modal-content {
		background-color: var(--color-surface-elevated);
		border-radius: var(--border-radius-lg);
		box-shadow: var(--shadow-xl);
		overflow: hidden;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-3) var(--spacing-4); /* Reduced padding for mobile */
		border-bottom: 1px solid var(--color-border);
	}

	.modal-title {
		font-size: var(--mobile-h2-size); /* Mobile-optimized heading size */
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		margin: 0;
		word-break: break-word; /* Prevent overflow on small screens */
	}

	.close-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px; /* Increased for better touch target */
		height: 44px; /* Increased for better touch target */
		border-radius: var(--border-radius-full);
		border: none;
		background-color: transparent;
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: background-color var(--transition-duration-fast) var(--transition-timing-default);
		touch-action: manipulation; /* Prevent double-tap zoom on mobile */
	}

	.close-button:hover {
		background-color: var(--color-light-hover-bg);
		color: var(--color-light-hover-text);
	}

	/* Active state for touch feedback */
	.close-button:active {
		background-color: var(--color-neutral-200);
		transform: scale(0.95);
	}

	.modal-body {
		padding: var(--spacing-4); /* Reduced padding for mobile */
		color: var(--color-text-secondary);
	}

	.modal-footer {
		display: flex;
		justify-content: space-between; /* Changed to space-between for mobile */
		gap: var(--spacing-3);
		padding: var(--spacing-3) var(--spacing-4); /* Reduced padding for mobile */
		border-top: 1px solid var(--color-border);
	}

	.cancel-button,
	.confirm-button {
		padding: var(--spacing-3) var(--spacing-4); /* Increased padding for touch */
		border-radius: var(--border-radius-md);
		font-weight: var(--font-weight-medium);
		cursor: pointer;
		transition:
			background-color var(--transition-duration-fast) var(--transition-timing-default),
			transform var(--transition-duration-fast) var(--transition-timing-default);
		min-height: var(--touch-target-size); /* Ensure minimum touch target height */
		min-width: 80px; /* Ensure minimum width for readability */
		flex: 1; /* Allow buttons to grow on mobile */
		touch-action: manipulation; /* Prevent double-tap zoom on mobile */
	}

	.cancel-button {
		background-color: var(--color-neutral-200);
		color: var(--color-text-primary);
		border: none;
	}

	.cancel-button:hover {
		background-color: var(--color-neutral-300);
		color: var(--color-neutral-900);
	}

	.confirm-button {
		border: none;
	}

	.confirm-button.primary {
		background-color: var(--color-primary-600);
		color: white;
	}

	.confirm-button.primary:hover {
		background-color: var(--color-primary-700);
	}

	.confirm-button.danger {
		background-color: var(--color-error-500);
		color: white;
	}

	.confirm-button.danger:hover {
		background-color: #d32f2f; /* Darker red */
	}

	.cancel-button:active,
	.confirm-button:active {
		transform: scale(0.98);
	}

	/* Dark mode adjustments */
	:global([data-theme='dark']) .close-button:hover {
		background-color: var(--color-dark-hover-bg);
		color: var(--color-dark-hover-text);
	}

	:global([data-theme='dark']) .cancel-button {
		background-color: var(--color-neutral-700);
		color: var(--color-neutral-200);
	}

	:global([data-theme='dark']) .cancel-button:hover {
		background-color: var(--color-neutral-600);
		color: var(--color-neutral-50);
	}

	:global([data-theme='dark']) .modal-title {
		color: var(--color-neutral-50);
	}

	:global([data-theme='dark']) .modal-body {
		color: var(--color-neutral-200);
	}

	/* Responsive adjustments */
	@media (min-width: 640px) {
		.modal-header {
			padding: var(--spacing-4) var(--spacing-6); /* Restore original padding */
		}

		.modal-title {
			font-size: var(--font-size-xl); /* Restore original font size */
		}

		.close-button {
			width: 32px; /* Restore original size */
			height: 32px; /* Restore original size */
		}

		.modal-body {
			padding: var(--spacing-6); /* Restore original padding */
		}

		.modal-footer {
			justify-content: flex-end; /* Restore original alignment */
			padding: var(--spacing-4) var(--spacing-6); /* Restore original padding */
		}

		.cancel-button,
		.confirm-button {
			padding: var(--spacing-2) var(--spacing-4); /* Restore original padding */
			min-height: auto; /* Reset to default */
			flex: none; /* Reset to default */
		}
	}
</style>
