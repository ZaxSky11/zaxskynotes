import { useState } from 'react';
import { Plus, FileText, Search as SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NoteCard } from './NoteCard';
import { NoteEditor } from './NoteEditor';
import { SearchBar } from './SearchBar';
import { useNotes } from '@/hooks/useNotes';
import { Note } from '@/types/note';
import { useToast } from '@/hooks/use-toast';

export function NotesApp() {
  const {
    notes,
    allTags,
    filter,
    setFilter,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
  } = useNotes();
  
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const { toast } = useToast();

  const handleCreateNote = () => {
    setEditingNote(undefined);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleSaveNote = (title: string, content: string, tags: string[], color?: Note['color']) => {
    if (editingNote) {
      updateNote(editingNote.id, { title, content, tags, color });
      toast({
        title: "Note updated",
        description: "Your note has been saved successfully.",
      });
    } else {
      createNote(title, content, tags);
      toast({
        title: "Note created",
        description: "Your new note has been created successfully.",
      });
    }
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    toast({
      title: "Note deleted",
      description: "The note has been deleted successfully.",
      variant: "destructive",
    });
  };

  const pinnedNotes = notes.filter(note => note.isPinned);
  const unpinnedNotes = notes.filter(note => !note.isPinned);

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-effect border-b px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
                Notes
              </h1>
            </div>
            <Button
              onClick={handleCreateNote}
              className="gap-2 bg-gradient-primary hover:scale-105 transition-transform"
            >
              <Plus className="h-4 w-4" />
              New Note
            </Button>
          </div>
          
          <SearchBar
            filter={filter}
            onFilterChange={setFilter}
            allTags={allTags}
            notesCount={notes.length}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {notes.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mb-6 animate-float">
              <FileText className="h-12 w-12 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Welcome to Notes</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start capturing your thoughts, ideas, and reminders. Create your first note to get started.
            </p>
            <Button
              onClick={handleCreateNote}
              size="lg"
              className="gap-2 bg-gradient-primary hover:scale-105 transition-transform"
            >
              <Plus className="h-5 w-5" />
              Create Your First Note
            </Button>
          </div>
        ) : (
          <>
            {/* Notes grid */}
            <div className="space-y-6">
              {/* Pinned notes */}
              {pinnedNotes.length > 0 && (
                <section>
                  <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Pinned
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {pinnedNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onEdit={handleEditNote}
                        onDelete={handleDeleteNote}
                        onTogglePin={togglePin}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Other notes */}
              {unpinnedNotes.length > 0 && (
                <section>
                  {pinnedNotes.length > 0 && (
                    <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                      Other notes
                    </h2>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {unpinnedNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onEdit={handleEditNote}
                        onDelete={handleDeleteNote}
                        onTogglePin={togglePin}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* No results message */}
            {notes.length === 0 && (filter.searchQuery || filter.selectedTags.length > 0 || filter.showPinnedOnly) && (
              <div className="flex flex-col items-center justify-center min-h-[30vh] text-center">
                <SearchIcon className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No notes found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or filters
                </p>
                <Button
                  variant="outline"
                  onClick={() => setFilter({ searchQuery: '', selectedTags: [], showPinnedOnly: false })}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={handleCreateNote}
        className="fab"
        aria-label="Create new note"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Note Editor Dialog */}
      <NoteEditor
        note={editingNote}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveNote}
        onTogglePin={editingNote ? togglePin : undefined}
      />
    </div>
  );
}
