import { useState, useEffect, useRef } from 'react';
import { Note } from '@/types/note';
import { X, Hash, Save, Pin, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface NoteEditorProps {
  note?: Note;
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, content: string, tags: string[], color?: Note['color']) => void;
  onTogglePin?: (id: string) => void;
}

const noteColors: { value: Note['color']; label: string; class: string }[] = [
  { value: undefined, label: 'Default', class: 'bg-surface' },
  { value: 'yellow', label: 'Yellow', class: 'bg-note-yellow' },
  { value: 'blue', label: 'Blue', class: 'bg-note-blue' },
  { value: 'green', label: 'Green', class: 'bg-note-green' },
  { value: 'pink', label: 'Pink', class: 'bg-note-pink' },
  { value: 'purple', label: 'Purple', class: 'bg-note-purple' },
];

export function NoteEditor({ note, isOpen, onClose, onSave, onTogglePin }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [color, setColor] = useState<Note['color']>();
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
      setColor(note.color);
    } else {
      setTitle('');
      setContent('');
      setTags([]);
      setColor(undefined);
    }
    setTagInput('');
    setShowColorPicker(false);
  }, [note, isOpen]);

  // Focus title input when dialog opens
  useEffect(() => {
    if (isOpen && titleRef.current) {
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    onSave(title || 'Untitled', content, tags, color);
    onClose();
  };

  const handleAddTag = (tagToAdd: string) => {
    const newTag = tagToAdd.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setTagInput('');
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (tagInput.trim()) {
        handleAddTag(tagInput);
      }
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className={cn(
          "max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0",
          color && noteColors.find(c => c.value === color)?.class
        )}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-4 pb-0">
          <DialogTitle className="sr-only">
            {note ? 'Edit Note' : 'New Note'}
          </DialogTitle>
          <div className="flex items-center gap-2">
            {note && onTogglePin && (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 w-9 p-0",
                  note.isPinned && "text-primary"
                )}
                onClick={() => onTogglePin(note.id)}
                title="Toggle pin"
              >
                <Pin className={cn("h-4 w-4", note.isPinned && "fill-current")} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 relative"
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="Change color"
            >
              <Palette className="h-4 w-4" />
              {showColorPicker && (
                <div className="absolute top-full right-0 mt-2 p-2 bg-popover border border-border rounded-lg shadow-lg z-50 flex gap-2">
                  {noteColors.map((colorOption) => (
                    <button
                      key={colorOption.label}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
                        colorOption.class,
                        color === colorOption.value ? "border-primary" : "border-border"
                      )}
                      onClick={() => {
                        setColor(colorOption.value);
                        setShowColorPicker(false);
                      }}
                      title={colorOption.label}
                    />
                  ))}
                </div>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 flex flex-col p-4 pt-2 gap-4 min-h-0">
          {/* Title */}
          <Input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="text-lg font-medium border-none bg-transparent px-0 h-auto py-2 focus-visible:ring-0"
          />

          {/* Content */}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing..."
            className="flex-1 resize-none border-none bg-transparent px-0 min-h-[200px] focus-visible:ring-0"
          />

          {/* Tags section */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
                  onClick={() => removeTag(tag)}
                >
                  <Hash className="h-3 w-3 mr-1" />
                  {tag}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Add tags... (press Enter or comma to add)"
              className="border-none bg-transparent px-0 h-auto py-1 text-sm focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 pt-0">
          <div className="text-xs text-muted-foreground">
            {note && (
              <span>
                Last edited {note.updatedAt.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
            )}
          </div>
          <Button
            onClick={handleSave}
            disabled={!title.trim() && !content.trim()}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}