import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { tasksQueryKey } from './get-tasks';

export async function deleteTask(id: string) {
  await api.delete(`/tasks/${id}`);
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    // After success OR failure (e.g. already deleted in another tab), reload the list
    onSettled: () => queryClient.invalidateQueries({ queryKey: tasksQueryKey }),
  });
}
