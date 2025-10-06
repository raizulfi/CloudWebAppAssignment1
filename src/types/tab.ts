export interface Tab {
  id: string;
  heading: string;
  content: string;
  order: number;
}

export interface TabsState {
  tabs: Tab[];
  activeTabId: string | null;
}
