import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Share } from '@/types/api';
import { sharesQueryKey } from './get-shares';

export async function shareBoard(boardId: string, email: string): Promise<Share[]> {
  const response = await api.post<{ shares: Share[] }>(`/boards/${boardId}/shares`, { email });
  return response.data.shares;
}

export function useShareBoard(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => shareBoard(boardId, email),
    // The server answers with the updated list, so put it straight into the cache (no refetch)
    onSuccess: (shares) => queryClient.setQueryData(sharesQueryKey(boardId), shares),
  });
}
