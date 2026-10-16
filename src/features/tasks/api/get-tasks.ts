import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Task } from '@/types/api';
import {
  isFiltering,
  matchesFilters,
  NO_FILTERS,
  toQueryParams,
  type TaskFilters,
} from '../filters';

// ['tasks'] = the full list (drag & drop works on this one).
// ['tasks', filters] = a filtered list, cached separately per combination of filters.
// Invalidating ['tasks'] refreshes BOTH, because query keys match by prefix.
export const tasksQueryKey = ['tasks'] as const;

export function tasksListKey(filters: TaskFilters) {
  return isFiltering(filters) ? [...tasksQueryKey, filters] : tasksQueryKey;
}

// ALL of the user's tasks in one request (or only the matching ones); each column picks out its own
export async function getTasks(filters: TaskFilters = NO_FILTERS): Promise<Task[]> {
  // The time ranges ("today", "overdue") are computed at the moment of the request, not earlier
  const response = await api.get<{ tasks: Task[] }>('/tasks', { params: toQueryParams(filters) });
  return response.data.tasks;
}

// Every board column calls this with the same filters, but TanStack Query sends just ONE request:
// components asking for the same key share the same cached answer.
export function useTasks(filters: TaskFilters = NO_FILTERS) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: tasksListKey(filters),
    queryFn: () => getTasks(filters),
    // While the server answers for a new combination of filters, show something useful at once:
    // the matching tasks picked out of the already-loaded full list (same rules as the server,
    // see matchesFilters), or failing that the previous results — never a loading skeleton.
    // The server's answer replaces the placeholder as soon as it arrives.
    placeholderData: (previous) => {
      if (isFiltering(filters)) {
        const full = queryClient.getQueryData<Task[]>(tasksQueryKey);
        if (full) return full.filter((task) => matchesFilters(task, filters));
      }
      return keepPreviousData(previous);
    },
  });
}
