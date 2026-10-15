import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export async function deleteBoard(id: string) {
  await api.delete(`/boards/${id}`);
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBoard,
    // Deleting a board also deletes its tasks on the server, so refresh EVERYTHING cached
    // (boards and tasks). Calling it without a key keeps this feature from knowing about tasks.
    // Runs after success OR failure (e.g. already deleted in another tab).
    onSettled: () => queryClient.invalidateQueries(),
  });
}
