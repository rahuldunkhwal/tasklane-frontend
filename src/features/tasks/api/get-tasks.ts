import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Task } from '@/types/api';

export const tasksQueryKey = ['tasks'] as const;

// ALL of the user's tasks in one request; each board column picks out its own
export async function getTasks(): Promise<Task[]> {
  const response = await api.get<{ tasks: Task[] }>('/tasks');
  return response.data.tasks;
}

// Every board column calls this, but TanStack Query sends just ONE request:
// components asking for the same key share the same cached answer.
export function useTasks() {
  return useQuery({ queryKey: tasksQueryKey, queryFn: getTasks });
}
