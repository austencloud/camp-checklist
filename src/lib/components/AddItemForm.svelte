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

<div class="mt-2 flex gap-2">
	<input
		type="text"
		bind:value={inputText}
		placeholder={placeholderText}
		class="flex-grow rounded border p-2"
		onkeydown={handleKeyDown}
	/>
	<button onclick={handleSubmit} class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
		{buttonText}
	</button>
</div>
