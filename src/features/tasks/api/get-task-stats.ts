import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { TaskStats } from '@/types/api';
import { tasksQueryKey } from './get-tasks';

// Stored UNDER the 'tasks' key on purpose: every task change already refreshes everything
// starting with 'tasks', so the dashboard counts update by themselves, with no extra code.
export const taskStatsQueryKey = [...tasksQueryKey, 'stats'] as const;

export async function getTaskStats(): Promise<TaskStats> {
  const response = await api.get<TaskStats>('/tasks/stats');
  return response.data;
}

export function useTaskStats() {
  return useQuery({ queryKey: taskStatsQueryKey, queryFn: getTaskStats });
}
