import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Share } from '@/types/api';

export const sharesQueryKey = (boardId: string) => ['boards', boardId, 'shares'] as const;

// Who a board is shared with (owner only)
export async function getShares(boardId: string): Promise<Share[]> {
  const response = await api.get<{ shares: Share[] }>(`/boards/${boardId}/shares`);
  return response.data.shares;
}

// `enabled`: only ask while the share dialog is open
export function useShares(boardId: string, enabled: boolean) {
  return useQuery({
    queryKey: sharesQueryKey(boardId),
    queryFn: () => getShares(boardId),
    enabled,
  });
}
