import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { sharesQueryKey, type BoardSharing } from './get-shares';

// Regenerate the board's invite link; the old link stops working.
export async function resetInviteLink(boardId: string): Promise<string> {
  const response = await api.post<{ inviteLink: string }>(`/boards/${boardId}/invite-link/reset`);
  return response.data.inviteLink;
}

export function useResetInviteLink(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => resetInviteLink(boardId),
    // Swap the new link into the cache so the dialog shows it immediately
    onSuccess: (inviteLink) =>
      queryClient.setQueryData<BoardSharing>(sharesQueryKey(boardId), (old) =>
        old ? { ...old, inviteLink } : { shares: [], inviteLink },
      ),
  });
}
