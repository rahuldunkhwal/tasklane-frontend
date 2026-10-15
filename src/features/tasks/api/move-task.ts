import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Task } from '@/types/api';
import { tasksQueryKey } from './get-tasks';

// "Put this task in board X at position N" (0 = top). The server works out the order number.
export type MoveTaskRequest = { id: string; boardId: string; index: number };

export async function moveTask({ id, boardId, index }: MoveTaskRequest): Promise<Task> {
  const response = await api.patch<{ task: Task }>(`/tasks/${id}/move`, { boardId, index });
  return response.data.task;
}

// The screen is already updated while dragging (see task-drag-and-drop.tsx), so there's no
// onMutate here. The caller restores the old list if this fails; afterwards we always reload.
export function useMoveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: moveTask,
    onSettled: () => queryClient.invalidateQueries({ queryKey: tasksQueryKey }),
  });
}
