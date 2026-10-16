import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { BoardInvite, Share } from '@/types/api';

// The Share dialog needs the current viewers and the pending emailed invites.
export type BoardSharing = { shares: Share[]; invites: BoardInvite[] };

export const sharesQueryKey = (boardId: string) => ['boards', boardId, 'shares'] as const;

// Who a board is shared with + who has been invited but hasn't joined yet (owner only)
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
