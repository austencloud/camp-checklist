<script lang="ts">
  // Props
  let { 
    placeholderText = "Add new item...", 
    buttonText = "Add",
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
</script>

<div class="flex gap-2 mt-2">
  <input
    type="text"
    bind:value={inputText}
    placeholder={placeholderText}
    class="flex-grow p-2 border rounded"
    on:keydown={(e) => e.key === 'Enter' && handleSubmit()}
  />
  <button 
    on:click={handleSubmit}
    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
  >
    {buttonText}
  </button>
</div>
