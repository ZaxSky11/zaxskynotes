import { Note } from '@/types/note';
import { Pin, Hash, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

const colorClasses = {
  yellow: 'bg-note-yellow',
  blue: 'bg-note-blue',
  green: 'bg-note-green',
  pink: 'bg-note-pink',
  purple: 'bg-note-purple',
};

export function NoteCard({ note, onEdit, onDelete, onTogglePin }: NoteCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open editor if clicking on dropdown or pin button
    if ((e.target as Element).closest('[data-dropdown]') || (e.target as Element).closest('[data-pin]')) {
      return;
    }
    onEdit(note);
  };

  return (
    <div 
      className={cn(
        'note-card animate-in group',
        note.isPinned && 'pinned',
        note.color && colorClasses[note.color]
      )}
      onClick={handleCardClick}
    >
      {/* Header with pin and menu */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-foreground line-clamp-2 flex-1 min-w-0">
          {note.title}
        </h3>
        <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0 hover:bg-background/50",
              note.isPinned && "text-primary opacity-100"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(note.id);
            }}
            data-pin
          >
            <Pin className={cn("h-4 w-4", note.isPinned && "fill-current")} />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild data-dropdown>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-background/50"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onEdit(note)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(note.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content preview */}
      {note.content && (
        <p className="text-muted-foreground text-sm line-clamp-4 mb-3 whitespace-pre-wrap">
          {note.content}
        </p>
      )}

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {note.tags.map((tag, index) => (
            <span key={index} className="tag">
              <Hash className="h-3 w-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer with date */}
      <div className="text-xs text-muted-foreground">
        {note.updatedAt.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: note.updatedAt.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
        })}
      </div>
    </div>
  );
}