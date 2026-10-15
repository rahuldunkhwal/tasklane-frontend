import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Board } from '@/types/api';
import { boardsQueryKey } from './get-boards';

type UpdateBoardRequest = { id: string; title: string };

export async function updateBoard({ id, title }: UpdateBoardRequest): Promise<Board> {
  const response = await api.patch<{ board: Board }>(`/boards/${id}`, { title });
  return response.data.board;
}

export function useUpdateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBoard,
    // After success OR failure (e.g. the board was deleted in another tab), reload the list
    // so the screen always matches the server
    onSettled: () => queryClient.invalidateQueries({ queryKey: boardsQueryKey }),
  });
}
