import { SearchIcon, XIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useTasks } from '../api/get-tasks';
import { useTaskFilters, type DueFilter } from '../filters';
import { PRIORITY_LABELS } from '../utils';

// A Select item can't have an empty value, so "no filter" is stored as 'all' / 'any' here
const ALL = 'all';
const ANY = 'any';
const DUE_LABELS: Record<DueFilter, string> = {
  overdue: 'Overdue',
  today: 'Due today',
  week: 'Next 7 days',
  none: 'No due date',
};
const SEARCH_DELAY_MS = 300;

export function TaskFiltersBar() {
  const { filters, setFilters, clearFilters, filtering } = useTaskFilters();
  const tasks = useTasks(filters); // same key as the columns → no extra request

  // What's typed in the box. The URL (and the request) is only updated once typing pauses.
  const [searchText, setSearchText] = useState(filters.search);
  const [lastUrlSearch, setLastUrlSearch] = useState(filters.search);
  // The URL changed from elsewhere (e.g. "Clear filters"): show that value in the box.
  // (Adjusting state during render is React's recommended alternative to an effect here.)
  if (filters.search !== lastUrlSearch) {
    setLastUrlSearch(filters.search);
    setSearchText(filters.search);
  }

  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []); // stop a pending update on unmount

  const onSearchChange = (value: string) => {
    setSearchText(value);
    // Debounce: wait until the user stops typing ("m", "mi", "mil", "milk" → one request)
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setFilters({ search: value }), SEARCH_DELAY_MS);
  };

  const onClear = () => {
    clearTimeout(timer.current);
    setSearchText('');
    clearFilters();
  };

  const pillTrigger = 'h-10 rounded-full bg-surface';

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative flex-1 sm:flex-none">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        {filtering && tasks.isFetching && (
          <Spinner className="absolute top-1/2 right-3.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input
          type="search"
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search tasks…"
          aria-label="Search tasks by title"
          maxLength={100}
          className="bg-surface pl-10 sm:w-62.5"
        />
      </div>

      <div className="flex gap-2">
        <Select
          value={filters.priority || ALL}
          onValueChange={(value) =>
            setFilters({ priority: value === ALL ? '' : (value as typeof filters.priority) })
          }
        >
          <SelectTrigger aria-label="Filter by priority" className={`${pillTrigger} w-full sm:w-36`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All priorities</SelectItem>
            {(['high', 'medium', 'low'] as const).map((priority) => (
              <SelectItem key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.due || ANY}
          onValueChange={(value) => setFilters({ due: value === ANY ? '' : (value as DueFilter) })}
        >
          <SelectTrigger aria-label="Filter by due date" className={`${pillTrigger} w-full sm:w-36`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>Any due date</SelectItem>
            {(Object.keys(DUE_LABELS) as DueFilter[]).map((due) => (
              <SelectItem key={due} value={due}>
                {DUE_LABELS[due]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(filtering || searchText) && (
          <Button variant="ghost" size="icon" onClick={onClear} aria-label="Clear filters">
            <XIcon />
          </Button>
        )}
      </div>
    </div>
  );
}
