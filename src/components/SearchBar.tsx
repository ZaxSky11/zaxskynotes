import { useState } from 'react';
import { Search, Filter, X, Hash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { NoteFilter } from '@/types/note';

interface SearchBarProps {
  filter: NoteFilter;
  onFilterChange: (filter: NoteFilter) => void;
  allTags: string[];
  notesCount: number;
}

export function SearchBar({ filter, onFilterChange, allTags, notesCount }: SearchBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearchChange = (query: string) => {
    onFilterChange({ ...filter, searchQuery: query });
  };

  const toggleTag = (tag: string) => {
    const newSelectedTags = filter.selectedTags.includes(tag)
      ? filter.selectedTags.filter(t => t !== tag)
      : [...filter.selectedTags, tag];
    
    onFilterChange({ ...filter, selectedTags: newSelectedTags });
  };

  const togglePinnedOnly = (checked: boolean) => {
    onFilterChange({ ...filter, showPinnedOnly: checked });
  };

  const clearFilters = () => {
    onFilterChange({
      searchQuery: '',
      selectedTags: [],
      showPinnedOnly: false,
    });
    setIsFilterOpen(false);
  };

  const hasActiveFilters = filter.selectedTags.length > 0 || filter.showPinnedOnly;
  const hasAnyFilter = filter.searchQuery || hasActiveFilters;

  return (
    <div className="w-full space-y-3">
      {/* Main search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={filter.searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={`Search ${notesCount} notes...`}
          className="search-input pl-12 pr-12"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 relative"
              >
                <Filter className="h-4 w-4" />
                {hasActiveFilters && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filters</h4>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                {/* Pinned filter */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pinned"
                    checked={filter.showPinnedOnly}
                    onCheckedChange={togglePinnedOnly}
                  />
                  <label htmlFor="pinned" className="text-sm font-medium">
                    Show pinned only
                  </label>
                </div>

                {/* Tags filter */}
                {allTags.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags</label>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {allTags.map((tag) => (
                        <div key={tag} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tag-${tag}`}
                            checked={filter.selectedTags.includes(tag)}
                            onCheckedChange={() => toggleTag(tag)}
                          />
                          <label
                            htmlFor={`tag-${tag}`}
                            className="text-sm flex items-center cursor-pointer"
                          >
                            <Hash className="h-3 w-3 mr-1 text-muted-foreground" />
                            {tag}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {hasAnyFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Active filters display */}
      {(filter.selectedTags.length > 0 || filter.showPinnedOnly) && (
        <div className="flex flex-wrap gap-2">
          {filter.showPinnedOnly && (
            <Badge variant="secondary" className="gap-1">
              Pinned only
              <button
                onClick={() => togglePinnedOnly(false)}
                className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filter.selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              <Hash className="h-3 w-3" />
              {tag}
              <button
                onClick={() => toggleTag(tag)}
                className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}