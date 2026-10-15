import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Share } from '@/types/api';

// The Share dialog needs both the current viewers and the board's invite link.
export type BoardSharing = { shares: Share[]; inviteLink: string };

export const sharesQueryKey = (boardId: string) => ['boards', boardId, 'shares'] as const;

// Who a board is shared with + its invite link (owner only)
export async function getShares(boardId: string): Promise<BoardSharing> {
  const response = await api.get<BoardSharing>(`/boards/${boardId}/shares`);
  return response.data;
}

// `enabled`: only ask while the share dialog is open
export function useShares(boardId: string, enabled: boolean) {
  return useQuery({
    queryKey: sharesQueryKey(boardId),
    queryFn: () => getShares(boardId),
    enabled,
  });
}
