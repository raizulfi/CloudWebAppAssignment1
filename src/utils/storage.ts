import { Tab, TabsState } from '../types/tab';

const STORAGE_KEY = 'assignment-tabs';

export function loadTabsFromStorage(): TabsState {
  if (typeof window === 'undefined') {
    return { tabs: [], activeTabId: null };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        tabs: parsed.tabs || [],
        activeTabId: parsed.activeTabId || null
      };
    }
  } catch (error) {
    console.error('Failed to load tabs from storage:', error);
  }

  return { tabs: [], activeTabId: null };
}

export function saveTabsToStorage(state: TabsState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save tabs to storage:', error);
  }
}

export function generateTabId(): string {
  return `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
