export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  color?: 'yellow' | 'blue' | 'green' | 'pink' | 'purple';
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteFilter {
  searchQuery: string;
  selectedTags: string[];
  showPinnedOnly: boolean;
}