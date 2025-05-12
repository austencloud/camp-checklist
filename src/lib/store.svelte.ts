// src/lib/store.svelte.ts
import type { Category, ChecklistItem, TodoItem } from './types';
import { v4 as uuidv4 } from 'uuid';

// --- Initial Data (based on the provided plan) ---
const initialCategories: Category[] = [
  {
    id: uuidv4(),
    name: "Kinetic Alphabet Supplies",
    items: [
      // { id: uuidv4(), text: "Letter A materials", completed: false }, // Example
    ]
  },
  {
    id: uuidv4(),
    name: "Camping Essentials",
    items: [
      { id: uuidv4(), text: "Tent", completed: false, isEssential: true },
      { id: uuidv4(), text: "Canopy", completed: false },
      { id: uuidv4(), text: "Canopy walls", completed: false },
      { id: uuidv4(), text: "Power generator", completed: false, isEssential: true },
      { id: uuidv4(), text: "Electric unicycle", completed: false },
      { id: uuidv4(), text: "Charger for electric unicycle", completed: false, isEssential: true },
      {
        id: uuidv4(), text: "Toiletries:", completed: false, isEssential: true,
        subItems: [
          { id: uuidv4(), text: "Toothbrush", completed: false },
          { id: uuidv4(), text: "Body wash", completed: false },
          { id: uuidv4(), text: "Shampoo", completed: false },
          { id: uuidv4(), text: "Contact solution", completed: false },
        ]
      },
      {
        id: uuidv4(), text: "Warmth items:", completed: false,
        subItems: [
          { id: uuidv4(), text: "Blankets", completed: false },
          { id: uuidv4(), text: "Pillows", completed: false },
          { id: uuidv4(), text: "Sheets for bed", completed: false },
        ]
      },
      { id: uuidv4(), text: "Table for inside tent", completed: false },
      { id: uuidv4(), text: "Storage bins", completed: false },
      { id: uuidv4(), text: "LED mirror", completed: false },
      { id: uuidv4(), text: "Lights for tent and campground (from garden)", completed: false },
    ]
  },
  {
    id: uuidv4(),
    name: "Flow Arts & Performance Gear",
    items: [
      { id: uuidv4(), text: "Prop bag", completed: false },
      { id: uuidv4(), text: "All vision clubs (including broken ones)", completed: false },
      { id: uuidv4(), text: "Fire triple staffs", completed: false },
      { id: uuidv4(), text: "Flowtoys triple staffs", completed: false },
      { id: uuidv4(), text: "Pyroteq triple staffs", completed: false },
      { id: uuidv4(), text: "Contact staff", completed: false },
      { id: uuidv4(), text: "Sword", completed: false },
      { id: uuidv4(), text: "Juggling balls", completed: false },
      { id: uuidv4(), text: "Torches", completed: false },
      { id: uuidv4(), text: "Double staffs", completed: false },
      { id: uuidv4(), text: "Fire gloves", completed: false },
      { id: uuidv4(), text: "Isopropyl alcohol", completed: false },
      { id: uuidv4(), text: "Fire contact ball", completed: false },
      { id: uuidv4(), text: "Splitter", completed: false },
      { id: uuidv4(), text: "Juggling plunger", completed: false },
      { id: uuidv4(), text: "Day props (e.g., day clubs)", completed: false },
      { id: uuidv4(), text: "Contact juggling balls", completed: false },
      { id: uuidv4(), text: "Magic: The Gathering cards", completed: false },
    ]
  },
  {
    id: uuidv4(),
    name: "Workshop & Tech Gear",
    items: [
      { id: uuidv4(), text: "Studio light set (for Nina's classes)", completed: false },
      { id: uuidv4(), text: "Projector", completed: false },
      { id: uuidv4(), text: "Projector screen", completed: false },
      { id: uuidv4(), text: "Projector stand", completed: false },
      { id: uuidv4(), text: "Laptop", completed: false },
      { id: uuidv4(), text: "Laptop charger", completed: false },
      { id: uuidv4(), text: "Laptop mouse", completed: false },
      { id: uuidv4(), text: "Keyboard", completed: false },
      { id: uuidv4(), text: "USB-C cords for charging", completed: false },
    ]
  }
];

const initialTodoItems: TodoItem[] = [
  { id: uuidv4(), text: "Reach out to Flowtoys about grip tape for triple staffs", completed: false },
];

// --- Reactive State using Svelte 5 Runes ---
export const categories = $state(initialCategories);
export const todoItems = $state(initialTodoItems);

// --- Functions to manipulate state ---

// Checklist Item Functions
export function addChecklistItem(categoryId: string, text: string, parentItemId?: string) {
  const newItem: ChecklistItem = { id: uuidv4(), text, completed: false };
  const category = categories.find(cat => cat.id === categoryId);
  if (category) {
    if (parentItemId) {
      const parentItem = findChecklistItemRecursive(category.items, parentItemId);
      if (parentItem) {
        if (!parentItem.subItems) {
          parentItem.subItems = [];
        }
        parentItem.subItems.push(newItem);
      }
    } else {
      category.items.push(newItem);
    }
  }
}

export function toggleChecklistItemCompleted(itemId: string) {
  for (const category of categories) {
    const item = findChecklistItemRecursive(category.items, itemId);
    if (item) {
      item.completed = !item.completed;
      // If it's a parent item, toggle its sub-items
      if (item.subItems) {
        toggleSubItems(item.subItems, item.completed);
      }
      return;
    }
  }
}

function findChecklistItemRecursive(items: ChecklistItem[], itemId: string): ChecklistItem | undefined {
  for (const item of items) {
    if (item.id === itemId) return item;
    if (item.subItems) {
      const foundInSub = findChecklistItemRecursive(item.subItems, itemId);
      if (foundInSub) return foundInSub;
    }
  }
  return undefined;
}

function toggleSubItems(subItems: ChecklistItem[], completedStatus: boolean) {
  for (const subItem of subItems) {
    subItem.completed = completedStatus;
    if (subItem.subItems) {
      toggleSubItems(subItem.subItems, completedStatus);
    }
  }
}

// Category Functions
export function addCategory(name: string) {
  categories.push({ id: uuidv4(), name, items: [] });
}

// Todo Item Functions
export function addTodoItem(text: string) {
  todoItems.push({ id: uuidv4(), text, completed: false });
}

export function toggleTodoItemCompleted(id: string) {
  const todo = todoItems.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
  }
}

// --- Persistence with localStorage (using $effect) ---
$effect(() => {
  if (typeof window !== 'undefined') { // Ensure localStorage is available
    localStorage.setItem('kineticFireCategories', JSON.stringify(categories));
    localStorage.setItem('kineticFireTodoItems', JSON.stringify(todoItems));
  }
});

// Load initial state from localStorage if available
if (typeof window !== 'undefined') {
  const storedCategories = localStorage.getItem('kineticFireCategories');
  if (storedCategories) {
    // Svelte 5: directly assign to $state variable
    categories.length = 0; // Clear initial array if needed
    categories.push(...JSON.parse(storedCategories));
  }
  const storedTodos = localStorage.getItem('kineticFireTodoItems');
  if (storedTodos) {
    todoItems.length = 0;
    todoItems.push(...JSON.parse(storedTodos));
  }
}
