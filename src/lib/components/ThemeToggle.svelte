<script lang="ts">
  // State
  let theme = $state(getInitialTheme());
  
  // Get initial theme based on system preference or stored preference
  function getInitialTheme() {
    if (typeof window === 'undefined') return 'light';
    
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) return storedTheme;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  // Toggle theme between light and dark
  function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  }
  
  // Apply theme on component mount
  $effect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  });
</script>

<button 
  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  class="theme-toggle"
  on:click={toggleTheme}
>
  {#if theme === 'dark'}
    <!-- Sun icon for dark mode -->
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  {:else}
    <!-- Moon icon for light mode -->
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  {/if}
</button>

<style>
  .theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: var(--border-radius-full);
    background-color: var(--color-surface);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);
    cursor: pointer;
    transition: all var(--transition-duration-normal) var(--transition-timing-default);
    box-shadow: var(--shadow-sm);
  }
  
  .theme-toggle:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-md);
  }
  
  .theme-toggle:focus-visible {
    outline: 2px solid var(--color-primary-500);
    outline-offset: 2px;
  }
  
  .theme-toggle svg {
    transition: transform var(--transition-duration-normal) var(--transition-timing-default);
  }
  
  .theme-toggle:hover svg {
    transform: rotate(12deg);
  }
</style>
