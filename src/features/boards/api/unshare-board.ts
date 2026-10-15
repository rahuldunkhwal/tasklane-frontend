import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { sharesQueryKey } from './get-shares';

export async function unshareBoard(boardId: string, userId: string) {
  await api.delete(`/boards/${boardId}/shares/${userId}`);
}

export function useUnshareBoard(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => unshareBoard(boardId, userId),
    // After success OR failure (e.g. already removed elsewhere), reload the list
    onSettled: () => queryClient.invalidateQueries({ queryKey: sharesQueryKey(boardId) }),
  });
}
