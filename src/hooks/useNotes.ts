import { useState, useEffect } from 'react';
import { Note, NoteFilter } from '@/types/note';

const STORAGE_KEY = 'notes-app-data';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filter, setFilter] = useState<NoteFilter>({
    searchQuery: '',
    selectedTags: [],
    showPinnedOnly: false,
  });

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        // Convert date strings back to Date objects
        const notesWithDates = parsedNotes.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }));
        setNotes(notesWithDates);
      } catch (error) {
        console.error('Failed to load notes from localStorage:', error);
      }
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const createNote = (title: string, content: string, tags: string[] = []) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: title.trim() || 'Untitled',
      content: content.trim(),
      tags,
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes(prev => [newNote, ...prev]);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date() }
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const togglePin = (id: string) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, isPinned: !note.isPinned, updatedAt: new Date() }
          : note
      )
    );
  };

  // Filter and sort notes
  const filteredNotes = notes.filter(note => {
    // Search filter
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      const matchesTitle = note.title.toLowerCase().includes(query);
      const matchesContent = note.content.toLowerCase().includes(query);
      const matchesTags = note.tags.some(tag => tag.toLowerCase().includes(query));
      
      if (!matchesTitle && !matchesContent && !matchesTags) {
        return false;
      }
    }

    // Tags filter
    if (filter.selectedTags.length > 0) {
      const hasSelectedTag = filter.selectedTags.some(tag => note.tags.includes(tag));
      if (!hasSelectedTag) {
        return false;
      }
    }

    // Pinned filter
    if (filter.showPinnedOnly && !note.isPinned) {
      return false;
    }

    return true;
  });

  // Sort: pinned first, then by updated date
  const sortedNotes = filteredNotes.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });

  // Get all unique tags
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags))).sort();

  return {
    notes: sortedNotes,
    allTags,
    filter,
    setFilter,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
  };
}