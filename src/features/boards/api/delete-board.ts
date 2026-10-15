import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { boardsQueryKey } from './get-boards';

export async function deleteBoard(id: string) {
  await api.delete(`/boards/${id}`);
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBoard,
    // After success OR failure (e.g. already deleted in another tab), reload the list
    onSettled: () => queryClient.invalidateQueries({ queryKey: boardsQueryKey }),
  });
}
