// src/lib/types.ts

export interface ChecklistItem {
  id: string; // Unique identifier (e.g., UUID)
  text: string;
  completed: boolean;
  isEssential?: boolean; // Optional, for items like "Tent"
  subItems?: ChecklistItem[]; // For nested items like "Toiletries"
}

export interface Category {
  id: string; // Unique identifier
  name: string;
  items: ChecklistItem[];
}

export interface TodoItem {
  id: string; // Unique identifier
  text: string;
  completed: boolean;
}
