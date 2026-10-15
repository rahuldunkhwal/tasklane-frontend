import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Board } from '@/types/api';
import type { BoardTitleInput } from '../schemas';
import { boardsQueryKey } from './get-boards';

export async function createBoard(input: BoardTitleInput): Promise<Board> {
  const response = await api.post<{ board: Board }>('/boards', input);
  return response.data.board;
}

export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBoard,
    // "The boards list is outdated" → TanStack Query reloads it. Returning the promise keeps the
    // mutation "pending" until the new list has arrived, so the dialog closes on an up-to-date screen.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: boardsQueryKey }),
  });
}
