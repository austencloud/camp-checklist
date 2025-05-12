<script lang="ts">
	import type { Category, ChecklistItem as ChecklistItemType } from '../types.js';
	import ChecklistItem from './ChecklistItem.svelte';
	import AddItemForm from './AddItemForm.svelte';
	import DeleteButton from './DeleteButton.svelte';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing'; // Smoother easing

	// Props
	let {
		category,
		addChecklistItem,
		toggleChecklistItemCompleted,
		deleteCategory,
		deleteChecklistItem,
		reorderChecklistItems
	} = $props<{
		category: Category;
		addChecklistItem: (categoryId: string, text: string, parentItemId?: string) => void;
		toggleChecklistItemCompleted: (itemId: string) => void;
		deleteCategory: (categoryId: string) => void;
		deleteChecklistItem: (categoryId: string, itemId: string, parentItemId?: string) => void;
		reorderChecklistItems: (categoryId: string, oldIndex: number, newIndex: number) => void;
	}>();

	// --- State ---
	let isExpanded = $state(true);
	let liveRegionMessage = $state(''); // For ARIA live region announcements

	// --- Drag & Drop State (Pointer Events) ---
	let draggedItemIndex = $state<number | null>(null);
	let draggedElement = $state<HTMLElement | null>(null); // Reference to the actual LI element being dragged
	let dragOverItemIndex = $state<number | null>(null);
	let isDraggingWithPointer = $state(false); // Flag to indicate pointer-based drag
	let pointerStartX = $state(0);
	let pointerStartY = $state(0);
	// INCREASED THRESHOLD: Require more movement before starting a drag
	let dragThreshold = 10; // Pixels pointer must move before drag starts (was 5)

	// --- Elements ---
	let listElement = $state<HTMLUListElement | null>(null); // Reference to the UL

	// --- Methods ---
	function handleAddItem(text: string) {
		addChecklistItem(category.id, text);
	}

	function toggleExpand() {
		isExpanded = !isExpanded;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			toggleExpand();
		}
	}

	function handleDeleteCategory() {
		deleteCategory(category.id);
		liveRegionMessage = `Category ${category.name} deleted.`;
	}

	function handleDeleteItem(itemId: string, parentItemId?: string) {
		// Find item text for announcement before deleting
		const itemToDelete = findItemForAnnouncement(category.items, itemId);
		deleteChecklistItem(category.id, itemId, parentItemId);
		liveRegionMessage = `Item ${itemToDelete?.text || ''} deleted.`;
	}

	// Helper to find item text before deletion for announcements
	function findItemForAnnouncement(items: ChecklistItemType[], itemId: string): ChecklistItemType | null {
		for (const item of items) {
			if (item.id === itemId) return item;
			if (item.subItems) {
				const found = findItemForAnnouncement(item.subItems, itemId);
				if (found) return found;
			}
		}
		return null;
	}


	// --- Pointer Event Handlers ---

	function handlePointerDown(index: number, e: PointerEvent) {
		// Only handle primary button (usually left mouse or single touch)
		if (e.button !== 0 || !(e.target instanceof HTMLElement)) return;

		// Prevent default text selection behavior
		e.preventDefault();

		// Get the button element itself to capture the pointer
		const handleButton = e.currentTarget as HTMLElement;

		// Explicitly capture pointer events on the handle
		handleButton.setPointerCapture(e.pointerId);

		draggedItemIndex = index;
		pointerStartX = e.clientX;
		pointerStartY = e.clientY;
		isDraggingWithPointer = false; // Reset flag until threshold is met

		// Find the parent LI element to apply styles
		draggedElement = handleButton.closest('li');

		// Add move/up listeners to the window to track movement anywhere
		window.addEventListener('pointermove', handlePointerMove);
		window.addEventListener('pointerup', handlePointerUp);
		window.addEventListener('pointercancel', handlePointerUp); // Treat cancel like up

		// Add grabbing cursor immediately on pointer down for better feedback
		handleButton.style.cursor = 'grabbing';
		if (draggedElement) {
			draggedElement.style.cursor = 'grabbing'; // Apply to the whole item potentially
		}
	}

	function handlePointerMove(e: PointerEvent) {
		if (draggedItemIndex === null || !draggedElement) return;

		// Prevent default touch actions like scrolling while dragging
		e.preventDefault();

		const deltaX = Math.abs(e.clientX - pointerStartX);
		const deltaY = Math.abs(e.clientY - pointerStartY);

		// Start dragging only after moving beyond the threshold
		if (!isDraggingWithPointer && (deltaX > dragThreshold || deltaY > dragThreshold)) {
			isDraggingWithPointer = true;
			draggedElement.classList.add('dragging-pointer'); // Add pointer-specific dragging class
			// Announce drag start
			const itemText = category.items[draggedItemIndex]?.text || 'item'; // Fallback text
			liveRegionMessage = `Started dragging ${itemText}. Use Alt+Arrow keys for keyboard control.`;
		}

		if (!isDraggingWithPointer) return; // Don't process move until drag starts

		// --- Hit Testing ---
		// Find which item the pointer is currently over
		let newDragOverIndex: number | null = null;
		if (listElement) {
			const listItems = Array.from(listElement.children) as HTMLElement[];
			for (let i = 0; i < listItems.length; i++) {
				// Skip the element being dragged
				if (i === draggedItemIndex) continue;

				const rect = listItems[i].getBoundingClientRect();
				// Check if pointer is within the vertical bounds of the item
				if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
					newDragOverIndex = i;
					break; // Found the item the pointer is over
				}
			}
		}


		// Update drag-over state and provide feedback
		if (newDragOverIndex !== dragOverItemIndex) {
			// Remove previous drag-over class
			if (dragOverItemIndex !== null && listElement) {
				const prevOverItem = listElement.children[dragOverItemIndex] as HTMLElement;
				prevOverItem?.classList.remove('drag-over');
			}

			dragOverItemIndex = newDragOverIndex;

			// Add new drag-over class
			if (dragOverItemIndex !== null && listElement && dragOverItemIndex !== draggedItemIndex) {
				const currentOverItem = listElement.children[dragOverItemIndex] as HTMLElement;
				currentOverItem?.classList.add('drag-over');
				const overItemText = category.items[dragOverItemIndex]?.text || 'item';
				liveRegionMessage = `Dragging over ${overItemText}.`;
			} else if (draggedItemIndex !== null) {
				// Reset message if not over a valid item
				const draggingItemText = category.items[draggedItemIndex]?.text || 'item';
				liveRegionMessage = `Dragging ${draggingItemText}.`;
			}
		}
	}


	function handlePointerUp(e: PointerEvent) {
		// Check if a drag was initiated before proceeding
		const wasDragging = isDraggingWithPointer;

		if (draggedItemIndex === null) return; // Guard: No item was being tracked initially

		// Get the button element that *should* have captured the pointer
		let handleButton: HTMLElement | null = null;
		if (draggedElement) {
			handleButton = draggedElement.querySelector('.drag-handle');
		}

		// Release pointer capture if it was captured by the button
		// Check if handleButton exists and if it actually has capture for this pointerId
		if (handleButton && handleButton.hasPointerCapture && handleButton.hasPointerCapture(e.pointerId)) {
			try { // Add try-catch as release can sometimes throw if state is weird
				handleButton.releasePointerCapture(e.pointerId);
			} catch (error) {
				console.error("Error releasing pointer capture:", error);
			}
		}

		// --- Handle Drop ---
		// Only reorder if an actual drag occurred (threshold exceeded)
		if (wasDragging && dragOverItemIndex !== null && dragOverItemIndex !== draggedItemIndex) {
			const oldIndex = draggedItemIndex;
			const newIndex = dragOverItemIndex;
			// Ensure indices are valid before calling reorder
			if (oldIndex >= 0 && oldIndex < category.items.length && newIndex >= 0 && newIndex < category.items.length) {
				reorderChecklistItems(category.id, oldIndex, newIndex);
				// Announce successful drop (use timeout to wait for potential DOM update)
				setTimeout(() => {
					const movedItemText = category.items[newIndex]?.text || 'item'; // Get text from new position
					liveRegionMessage = `Moved ${movedItemText} to position ${newIndex + 1}.`;
				}, 0);
			} else {
				// Announce cancellation if indices became invalid
				const cancelledItemText = category.items[draggedItemIndex]?.text || 'item';
				liveRegionMessage = `Drag cancelled for ${cancelledItemText}.`;
			}

		} else if (wasDragging && draggedItemIndex !== null) {
			// Announce cancelled drop if dragged but not dropped on a valid target
			const cancelledItemText = category.items[draggedItemIndex]?.text || 'item';
			liveRegionMessage = `Drag cancelled for ${cancelledItemText}.`;
		}
		// If it wasn't dragging (i.e., just a click), do nothing related to reordering.

		// --- Cleanup ---
		// Reset cursor styles
		if (handleButton) {
			handleButton.style.cursor = 'grab'; // Reset handle cursor
		}
		if (draggedElement) {
			draggedElement.classList.remove('dragging-pointer');
			draggedElement.style.cursor = ''; // Reset item cursor
		}
		if (dragOverItemIndex !== null && listElement) {
			// Ensure the index is still valid before accessing child
			if (dragOverItemIndex >= 0 && dragOverItemIndex < listElement.children.length) {
				const overItem = listElement.children[dragOverItemIndex] as HTMLElement;
				overItem?.classList.remove('drag-over');
			}
		}

		// Reset state variables regardless of whether a drag occurred
		draggedItemIndex = null;
		dragOverItemIndex = null;
		draggedElement = null;
		isDraggingWithPointer = false; // CRITICAL: Ensure this is always reset

		// Remove window listeners
		window.removeEventListener('pointermove', handlePointerMove);
		window.removeEventListener('pointerup', handlePointerUp);
		window.removeEventListener('pointercancel', handlePointerUp);
	}


	// --- Keyboard Reordering ---
	function handleItemKeyDown(index: number, e: KeyboardEvent) {
		let moved = false;
		let newIndex = index;
		const currentItemText = category.items[index]?.text || 'item';

		// Move item up with Alt+ArrowUp
		if (e.altKey && e.key === 'ArrowUp') {
			e.preventDefault();
			if (index > 0) {
				newIndex = index - 1;
				reorderChecklistItems(category.id, index, newIndex);
				moved = true;
			} else {
				liveRegionMessage = `${currentItemText} is already at the top.`;
			}
		}
		// Move item down with Alt+ArrowDown
		else if (e.altKey && e.key === 'ArrowDown') {
			e.preventDefault();
			if (index < category.items.length - 1) {
				newIndex = index + 1;
				reorderChecklistItems(category.id, index, newIndex);
				moved = true;
			} else {
				liveRegionMessage = `${currentItemText} is already at the bottom.`;
			}
		}

		// Announce keyboard move and manage focus
		if (moved) {
			const movedItemText = category.items[newIndex]?.text || 'item';
			liveRegionMessage = `Moved ${movedItemText} to position ${newIndex + 1}.`;
			// Set focus to the moved item's handle after a short delay
			setTimeout(() => {
				if (listElement) {
					const newItemElement = listElement.children[newIndex] as HTMLElement;
					const handle = newItemElement?.querySelector('.drag-handle') as HTMLElement | null;
					handle?.focus();
				}
			}, 50); // Delay allows Svelte to update the DOM
		}
	}

	// --- Computed ---
	const completedItemsCount = $derived(
		category.items.filter((item: ChecklistItemType) => item.completed).length
	);

	const totalItemsCount = $derived(category.items.length);

	const progress = $derived(
		totalItemsCount > 0 ? Math.round((completedItemsCount / totalItemsCount) * 100) : 0
	);
</script>

<div class="visually-hidden" aria-live="assertive" aria-atomic="true">
	{liveRegionMessage}
</div>

<div class="category-card" role="region" aria-label="Category: {category.name}">
	<div
		class="category-header"
		role="button"
		tabindex="0"
		aria-expanded={isExpanded}
		onclick={toggleExpand}
		onkeydown={handleKeyDown}
	>
		<div class="category-header-content">
			<h2 class="category-title">{category.name}</h2>
			<div class="category-actions">
				<DeleteButton
					itemName={category.name}
					itemType="category"
					onDelete={handleDeleteCategory}
					small={true}
				/>
			</div>
		</div>
		<div class="category-controls">
			<div class="category-progress">
				<div class="progress-text">{completedItemsCount}/{totalItemsCount}</div>
				<div class="progress-bar-container">
					<div class="progress-bar" style="width: {progress}%"></div>
				</div>
			</div>
			<div class="expand-button-wrapper">
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
					class="chevron-icon"
					class:rotated={!isExpanded}
					aria-label={isExpanded ? 'Collapse category' : 'Expand category'}
				>
					<polyline points="6 9 12 15 18 9"></polyline>
				</svg>
			</div>
		</div>
	</div>

	{#if isExpanded}
		<div class="category-content" transition:slide={{ duration: 250, easing: quintOut }}>
			{#if category.items.length === 0}
				<div class="empty-items">
					<p>No items in this category yet.</p>
				</div>
			{:else}
				<ul class="checklist-items" role="list" bind:this={listElement}>
					{#each category.items as item, index (item.id) }
						<li
							class="checklist-item-wrapper slide-in-right"
							class:dragging-pointer={isDraggingWithPointer && draggedItemIndex === index}
							class:drag-over={dragOverItemIndex === index && dragOverItemIndex !== draggedItemIndex} style="animation-delay: {index * 50}ms"
							aria-labelledby="item-text-{item.id}"
						>
							<div class="item-with-handle">
								<button
									type="button"
									class="drag-handle"
									aria-label="Drag to reorder item {item.text}. Press Alt + Arrow Up or Down to move."
									title="Drag or use Alt+Arrows to reorder item"
									onpointerdown={(e) => handlePointerDown(index, e)}
									onkeydown={(e) => handleItemKeyDown(index, e)}
									tabindex="0"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="drag-icon"
										aria-hidden="true"
									>
										<line x1="4" y1="8" x2="20" y2="8"></line>
										<line x1="4" y1="12" x2="20" y2="12"></line>
										<line x1="4" y1="16" x2="20" y2="16"></line>
									</svg>
								</button>
								<ChecklistItem
									{item}
									itemIdForLabel="item-text-{item.id}"
									categoryId={category.id}
									{addChecklistItem}
									{toggleChecklistItemCompleted}
									deleteItem={handleDeleteItem}
									showAddSubItem={true}
								/>
							</div>
						</li>
					{/each}
				</ul>
			{/if}

			<div class="add-item-form">
				<AddItemForm
					placeholderText="Add new item to this category..."
					buttonText="Add Item"
					onSubmit={handleAddItem}
				/>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Visually hidden style for the ARIA live region */
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.category-card {
		background-color: var(--color-surface);
		border-radius: var(--border-radius-lg);
		box-shadow: var(--shadow-md);
		overflow: hidden; /* Keep hidden */
		transition:
			box-shadow var(--transition-duration-normal) var(--transition-timing-default),
			transform var(--transition-duration-normal) var(--transition-timing-default),
			background-color var(--transition-duration-normal) var(--transition-timing-default);
		width: 100%;
		min-width: 0;
		max-width: 100%;
	}

	.category-card:hover {
		box-shadow: var(--shadow-lg);
		transform: translateY(-2px);
	}

	.category-card:active {
		transform: scale(0.99);
		box-shadow: var(--shadow-sm);
	}

	.category-header {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2);
		padding: var(--container-spacing);
		background-color: var(--color-light-header-bg);
		border-bottom: 1px solid var(--color-primary-200);
		cursor: pointer;
		transition: background-color var(--transition-duration-normal) var(--transition-timing-default);
		min-height: var(--touch-target-size);
		width: 100%;
	}

	.category-header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		min-width: 0;
	}

	.category-actions {
		opacity: 1;
		transition: opacity var(--transition-duration-fast) var(--transition-timing-default);
		flex-shrink: 0;
	}

	.category-title {
		font-size: var(--heading-h2-size);
		font-weight: var(--font-weight-bold);
		color: var(--color-primary-900);
		margin: 0;
		transition: color var(--transition-duration-normal) var(--transition-timing-default);
		word-break: break-word;
		overflow-wrap: break-word;
		hyphens: auto;
		flex: 1;
		min-width: 0;
		padding-right: var(--spacing-2);
	}

	.category-controls {
		display: flex;
		align-items: center;
		gap: var(--spacing-2);
		width: 100%;
		margin-top: var(--spacing-2);
		min-width: 0;
	}

	.category-progress {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-1);
		flex: 1;
		margin-right: var(--spacing-2);
		min-width: 0;
		width: 100%;
	}

	.progress-text {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		width: 100%;
		display: flex;
		justify-content: flex-end;
	}

	.progress-bar-container {
		width: 100%;
		height: clamp(6px, 1.5vw, 8px);
		background-color: var(--color-neutral-200);
		border-radius: var(--border-radius-full);
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background-color: var(--color-primary-500);
		border-radius: var(--border-radius-full);
		transition: width var(--transition-duration-normal) var(--transition-timing-default);
	}

	.expand-button-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--touch-target-size);
		height: var(--touch-target-size);
		border-radius: var(--border-radius-full);
		background-color: transparent;
		color: var(--color-text-secondary);
		transition:
			background-color var(--transition-duration-fast) var(--transition-timing-default),
			color var(--transition-duration-fast) var(--transition-timing-default);
		touch-action: manipulation;
		flex-shrink: 0;
	}

	.chevron-icon {
		transition: transform var(--transition-duration-normal) var(--transition-timing-default);
	}

	.rotated {
		transform: rotate(180deg);
	}

	.category-content {
		padding: var(--container-spacing);
		width: 100%;
		min-width: 0;
	}

	.checklist-items {
		list-style: none;
		padding: 0;
		margin: 0;
		margin-bottom: var(--spacing-4);
		width: 100%;
		position: relative;
	}

	.checklist-item-wrapper {
		margin-bottom: var(--item-spacing);
		width: 100%;
		transition: transform 0.2s ease-in-out;
	}

	.empty-items {
		padding: var(--spacing-4);
		text-align: center;
		color: var(--color-text-tertiary);
		font-style: italic;
		width: 100%;
	}

	.add-item-form {
		margin-top: var(--spacing-4);
		padding-top: var(--spacing-4);
		border-top: 1px solid var(--color-border);
		width: 100%;
	}

	/* Dark mode adjustments */
	:global([data-theme='dark']) .category-header {
		background-color: var(--color-dark-header-bg);
		border-bottom: 1px solid var(--color-primary-800);
	}
	:global([data-theme='dark']) .category-title { color: var(--color-primary-100); }
	:global([data-theme='dark']) .progress-text { color: var(--color-text-secondary); }
	:global([data-theme='dark']) .progress-bar-container { background-color: var(--color-neutral-700); }
	:global([data-theme='dark']) .progress-bar { background-color: var(--color-primary-400); }
	:global([data-theme='dark']) .expand-button-wrapper { color: var(--color-neutral-300); }
	:global([data-theme='dark']) .category-card:hover { box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3); }

	/* Drag and drop styles */
	.item-with-handle {
		display: flex;
		align-items: center;
		width: 100%;
		min-width: 0;
	}

	.drag-handle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--touch-target-size);
		height: var(--touch-target-size);
		min-width: var(--touch-target-size);
		cursor: grab;
		color: var(--color-text-tertiary);
		background: transparent;
		border: none;
		padding: 0;
		margin-right: var(--spacing-2);
		border-radius: var(--border-radius-md);
		transition:
			background-color var(--transition-duration-fast) var(--transition-timing-default),
			color var(--transition-duration-fast) var(--transition-timing-default),
			transform var(--transition-duration-fast) var(--transition-timing-default);
		touch-action: none; /* Prevent scrolling when dragging handle */
	}

	.drag-handle:hover,
	.drag-handle:focus {
		color: var(--color-primary-600);
		background-color: var(--color-primary-50);
		transform: scale(1.05);
	}

	.drag-handle:active {
		cursor: grabbing;
		transform: scale(0.95);
		background-color: var(--color-primary-100);
	}

	.dragging-pointer .drag-handle {
		cursor: grabbing;
	}

	.drag-icon {
		width: 24px;
		height: 24px;
		min-width: 24px;
        pointer-events: none;
	}

	.dragging-pointer {
		opacity: 0.7;
		box-shadow: var(--shadow-xl);
		z-index: 10;
		background-color: var(--color-surface-elevated);
		cursor: grabbing;
	}

	.drag-over {
		outline: 2px dashed var(--color-primary-500);
		outline-offset: -2px;
		background-color: var(--color-primary-50);
	}

	/* Dark mode adjustments for drag and drop */
	:global([data-theme='dark']) .drag-handle { color: var(--color-neutral-400); }
	:global([data-theme='dark']) .drag-handle:hover,
	:global([data-theme='dark']) .drag-handle:focus {
		color: var(--color-primary-300);
		background-color: var(--color-primary-900);
	}
	:global([data-theme='dark']) .drag-handle:active,
	:global([data-theme='dark']) .dragging-pointer .drag-handle {
		background-color: var(--color-primary-800);
	}
	:global([data-theme='dark']) .drag-over {
		outline-color: var(--color-primary-400);
		background-color: var(--color-neutral-800);
	}
	:global([data-theme='dark']) .dragging-pointer {
		background-color: var(--color-neutral-700);
	}

</style>
