import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Task } from '@/types/api';
import { tasksQueryKey } from './get-tasks';

// Send only what changes, e.g. { id, completed: true }
export type UpdateTaskRequest = { id: string } & Partial<
  Pick<Task, 'title' | 'description' | 'priority' | 'dueDate' | 'completed'>
>;

export async function updateTask({ id, ...changes }: UpdateTaskRequest): Promise<Task> {
  const response = await api.patch<{ task: Task }>(`/tasks/${id}`, changes);
  return response.data.task;
}

// OPTIMISTIC update: change the screen first, then ask the server.
// The checkbox ticks instantly instead of waiting for the network.
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,

    // 1. Before the request: apply the change to the cached list right away
    onMutate: async ({ id, ...changes }) => {
      // Stop any refetch in progress, so an older answer can't overwrite our change
      await queryClient.cancelQueries({ queryKey: tasksQueryKey });
      const previous = queryClient.getQueryData<Task[]>(tasksQueryKey); // kept for rollback
      queryClient.setQueryData<Task[]>(tasksQueryKey, (tasks) =>
        tasks?.map((task) => (task.id === id ? { ...task, ...changes } : task)),
      );
      return { previous };
    },

    // 2. The server said no: put the old list back (the component shows the error)
    onError: (_error, _request, context) => {
      queryClient.setQueryData(tasksQueryKey, context?.previous);
    },

    // 3. Either way: reload from the server so the screen matches the truth
    onSettled: () => queryClient.invalidateQueries({ queryKey: tasksQueryKey }),
  });
}
