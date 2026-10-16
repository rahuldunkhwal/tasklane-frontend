import { useSearchParams } from 'react-router';
import type { Task, TaskPriority } from '@/types/api';

export type DueFilter = 'overdue' | 'today' | 'week' | 'none';

// What the user chose in the filter bar ('' = not filtering on that)
export type TaskFilters = {
  search: string;
  priority: TaskPriority | '';
  due: DueFilter | '';
};

export const NO_FILTERS: TaskFilters = { search: '', priority: '', due: '' };

const PRIORITIES: readonly string[] = ['low', 'medium', 'high'];
const DUE_FILTERS: readonly string[] = ['overdue', 'today', 'week', 'none'];

export function isFiltering(filters: TaskFilters) {
  return filters.search.trim() !== '' || filters.priority !== '' || filters.due !== '';
}

// The filters live in the URL (/?q=milk&priority=high&due=overdue): they survive a refresh and
// can be shared. Values that don't make sense (a hand-edited ?priority=urgent) are ignored.
export function useTaskFilters() {
  const [params, setParams] = useSearchParams();

  const priority = params.get('priority') ?? '';
  const due = params.get('due') ?? '';
  const filters: TaskFilters = {
    search: params.get('q') ?? '',
    priority: PRIORITIES.includes(priority) ? (priority as TaskPriority) : '',
    due: DUE_FILTERS.includes(due) ? (due as DueFilter) : '',
  };

  const setFilters = (changes: Partial<TaskFilters>) => {
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        const urlNames = { search: 'q', priority: 'priority', due: 'due' } as const;
        for (const [key, value] of Object.entries(changes) as [keyof TaskFilters, string][]) {
          if (value) next.set(urlNames[key], value);
          else next.delete(urlNames[key]); // empty = remove it from the URL
        }
        return next;
      },
      { replace: true }, // update the address without adding a history entry per keystroke
    );
  };

  return {
    filters,
    setFilters,
    clearFilters: () => setFilters(NO_FILTERS),
    filtering: isFiltering(filters),
  };
}

// The filters → the API's query parameters. "Today" and "next 7 days" depend on the user's
// time zone, so the browser computes the exact moments; the server only compares dates.
export function toQueryParams(filters: TaskFilters, now = new Date()): Record<string, string> {
  const params: Record<string, string> = {};
  const search = filters.search.trim();
  if (search) params.search = search;
  if (filters.priority) params.priority = filters.priority;

  const endOfDay = (daysFromToday: number) =>
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysFromToday, 23, 59, 59, 999);

  switch (filters.due) {
    case 'overdue': // not done, and the due moment has passed (the company's definition)
      params.completed = 'false';
      params.dueTo = now.toISOString();
      break;
    case 'today':
      params.dueFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      params.dueTo = endOfDay(0).toISOString();
      break;
    case 'week': // from now until the end of the 7th day (today included)
      params.dueFrom = now.toISOString();
      params.dueTo = endOfDay(6).toISOString();
      break;
    case 'none':
      params.noDueDate = 'true';
      break;
  }
  return params;
}

// The SAME rules as toQueryParams, applied in the browser to the tasks already loaded. Used to
// show results the instant a filter changes, while the server's answer (the source of truth)
// is still on its way. Keep the two in sync: the server's result replaces this one.
export function matchesFilters(task: Task, filters: TaskFilters, now = new Date()): boolean {
  const search = filters.search.trim().toLowerCase();
  if (search && !task.title.toLowerCase().includes(search)) return false;
  if (filters.priority && task.priority !== filters.priority) return false;

  const due = task.dueDate ? new Date(task.dueDate).getTime() : null;
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endOfDay = (daysFromToday: number) =>
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + daysFromToday,
      23,
      59,
      59,
      999,
    ).getTime();

  switch (filters.due) {
    case 'overdue':
      return !task.completed && due !== null && due <= now.getTime();
    case 'today':
      return due !== null && due >= startOfToday && due <= endOfDay(0);
    case 'week':
      return due !== null && due >= now.getTime() && due <= endOfDay(6);
    case 'none':
      return due === null;
    default:
      return true;
  }
}
