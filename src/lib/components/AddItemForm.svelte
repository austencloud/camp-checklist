<script lang="ts">
	// Props
	let {
		placeholderText = 'Add new item...',
		buttonText = 'Add',
		onSubmit
	} = $props<{
		placeholderText?: string;
		buttonText?: string;
		onSubmit: (text: string) => void;
	}>();

	// State
	let inputText = $state('');

	// Methods
	function handleSubmit() {
		if (inputText.trim()) {
			onSubmit(inputText.trim());
			inputText = '';
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleSubmit();
		}
	}
</script>

<form
	class="add-item-form"
	onsubmit={(e) => {
		e.preventDefault();
		handleSubmit();
	}}
>
	<div class="form-content">
		<input
			type="text"
			bind:value={inputText}
			placeholder={placeholderText}
			class="form-input"
			onkeydown={handleKeyDown}
			aria-label={placeholderText}
		/>
		<button type="submit" class="submit-button">
			{buttonText}
		</button>
	</div>
</form>

<style>
	.add-item-form {
		width: 100%;
	}

	.form-content {
		display: flex;
		gap: var(--spacing-2);
		width: 100%;
	}

	.form-input {
		flex-grow: 1;
		padding: var(--spacing-2) var(--spacing-3);
		border-radius: var(--border-radius-md);
		border: 1px solid var(--color-border);
		background-color: var(--color-surface);
		color: var(--color-text-primary);
		transition:
			border-color var(--transition-duration-fast) var(--transition-timing-default),
			box-shadow var(--transition-duration-fast) var(--transition-timing-default);
	}

	.form-input:focus {
		border-color: var(--color-primary-500);
		box-shadow: 0 0 0 1px var(--color-primary-500);
		outline: none;
	}

	.form-input::placeholder {
		color: var(--color-text-tertiary);
	}

	.submit-button {
		padding: var(--spacing-2) var(--spacing-4);
		background-color: var(--color-primary-600);
		color: white;
		border: none;
		border-radius: var(--border-radius-md);
		font-weight: var(--font-weight-medium);
		transition:
			background-color var(--transition-duration-fast) var(--transition-timing-default),
			transform var(--transition-duration-fast) var(--transition-timing-default),
			box-shadow var(--transition-duration-fast) var(--transition-timing-default);
	}

	.submit-button:hover {
		background-color: var(--color-primary-700);
		transform: translateY(-1px);
		box-shadow: var(--shadow-sm);
	}

	.submit-button:active {
		transform: translateY(0);
	}

	.submit-button:focus-visible {
		outline: 2px solid var(--color-primary-500);
		outline-offset: 2px;
	}
</style>
