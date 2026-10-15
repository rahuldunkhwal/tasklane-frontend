import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Task } from '@/types/api';
import { tasksQueryKey } from './get-tasks';

export type CreateTaskRequest = Pick<
  Task,
  'boardId' | 'title' | 'description' | 'priority' | 'dueDate'
>;

export async function createTask(input: CreateTaskRequest): Promise<Task> {
  const response = await api.post<{ task: Task }>('/tasks', input);
  return response.data.task;
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    // Reload the task list; the dialog closes once the new task is on screen
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tasksQueryKey }),
  });
}
