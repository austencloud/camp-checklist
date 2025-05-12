// src/lib/initialData.ts
import type { Category, ChecklistItem, TodoItem } from './types.js';
import { v4 as uuidv4 } from 'uuid';

// --- Initial Data for the application ---
export const initialCategories: Category[] = [
  {
    id: uuidv4(),
    name: 'TKA',
    items: [
      // { id: uuidv4(), text: "Letter A materials", completed: false }, // Example
    ]
  },
  {
    id: uuidv4(),
    name: 'Camping Essentials',
    items: [
      { id: uuidv4(), text: 'Tent', completed: false, isEssential: true },
      { id: uuidv4(), text: 'Canopy', completed: false },
      { id: uuidv4(), text: 'Canopy walls', completed: false },
      { id: uuidv4(), text: 'Power generator', completed: false, isEssential: true },
      { id: uuidv4(), text: 'Electric unicycle', completed: false },
      { id: uuidv4(), text: 'Charger for electric unicycle', completed: false, isEssential: true },
      {
        id: uuidv4(),
        text: 'Toiletries:',
        completed: false,
        isEssential: true,
        subItems: [
          { id: uuidv4(), text: 'Toothbrush', completed: false },
          { id: uuidv4(), text: 'Body wash', completed: false },
          { id: uuidv4(), text: 'Shampoo', completed: false },
          { id: uuidv4(), text: 'Contact solution', completed: false }
        ]
      },
      {
        id: uuidv4(),
        text: 'Warmth items:',
        completed: false,
        subItems: [
          { id: uuidv4(), text: 'Blankets', completed: false },
          { id: uuidv4(), text: 'Pillows', completed: false },
          { id: uuidv4(), text: 'Sheets for bed', completed: false }
        ]
      },
      { id: uuidv4(), text: 'Table for inside tent', completed: false },
      { id: uuidv4(), text: 'Storage bins', completed: false },
      { id: uuidv4(), text: 'LED mirror', completed: false },
      { id: uuidv4(), text: 'Lights for tent and campground (from garden)', completed: false }
    ]
  },
  {
    id: uuidv4(),
    name: 'Flow Arts & Performance Gear',
    items: [
      { id: uuidv4(), text: 'Prop bag', completed: false },
      { id: uuidv4(), text: 'All vision clubs (including broken ones)', completed: false },
      { id: uuidv4(), text: 'Fire triple staffs', completed: false },
      { id: uuidv4(), text: 'Flowtoys triple staffs', completed: false },
      { id: uuidv4(), text: 'Pyroteq triple staffs', completed: false },
      { id: uuidv4(), text: 'Contact staff', completed: false },
      { id: uuidv4(), text: 'Sword', completed: false },
      { id: uuidv4(), text: 'Juggling balls', completed: false },
      { id: uuidv4(), text: 'Torches', completed: false },
      { id: uuidv4(), text: 'Double staffs', completed: false },
      { id: uuidv4(), text: 'Fire gloves', completed: false },
      { id: uuidv4(), text: 'Isopropyl alcohol', completed: false },
      { id: uuidv4(), text: 'Fire contact ball', completed: false },
      { id: uuidv4(), text: 'Splitter', completed: false },
      { id: uuidv4(), text: 'Juggling plunger', completed: false },
      { id: uuidv4(), text: 'Day props (e.g., day clubs)', completed: false },
      { id: uuidv4(), text: 'Contact juggling balls', completed: false },
      { id: uuidv4(), text: 'Magic: The Gathering cards', completed: false }
    ]
  },
  {
    id: uuidv4(),
    name: 'Workshop & Tech Gear',
    items: [
      { id: uuidv4(), text: "Studio light set (for Nina's classes)", completed: false },
      { id: uuidv4(), text: 'Projector', completed: false },
      { id: uuidv4(), text: 'Projector screen', completed: false },
      { id: uuidv4(), text: 'Projector stand', completed: false },
      { id: uuidv4(), text: 'Laptop', completed: false },
      { id: uuidv4(), text: 'Laptop charger', completed: false },
      { id: uuidv4(), text: 'Laptop mouse', completed: false },
      { id: uuidv4(), text: 'Keyboard', completed: false },
      { id: uuidv4(), text: 'USB-C cords for charging', completed: false }
    ]
  }
];

export const initialTodoItems: TodoItem[] = [
  {
    id: uuidv4(),
    text: 'Reach out to Flowtoys about grip tape for triple staffs',
    completed: false
  }
];

// Helper functions that don't rely on reactive state
export function findChecklistItemRecursive(
  items: ChecklistItem[],
  itemId: string
): ChecklistItem | undefined {
  for (const item of items) {
    if (item.id === itemId) return item;
    if (item.subItems) {
      const foundInSub = findChecklistItemRecursive(item.subItems, itemId);
      if (foundInSub) return foundInSub;
    }
  }
  return undefined;
}

export function toggleSubItems(subItems: ChecklistItem[], completedStatus: boolean) {
  for (const subItem of subItems) {
    subItem.completed = completedStatus;
    if (subItem.subItems) {
      toggleSubItems(subItem.subItems, completedStatus);
    }
  }
}

// Load data from localStorage (to be called in the component)
export function loadFromLocalStorage() {
  if (typeof window === 'undefined') return { loadedCategories: null, loadedTodoItems: null };
  
  const storedCategories = localStorage.getItem('kineticFireCategories');
  const storedTodos = localStorage.getItem('kineticFireTodoItems');
  
  return {
    loadedCategories: storedCategories ? JSON.parse(storedCategories) : null,
    loadedTodoItems: storedTodos ? JSON.parse(storedTodos) : null
  };
}

// Save data to localStorage (to be called in the component)
export function saveToLocalStorage(categories: Category[], todoItems: TodoItem[]) {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('kineticFireCategories', JSON.stringify(categories));
  localStorage.setItem('kineticFireTodoItems', JSON.stringify(todoItems));
}
