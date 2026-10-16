import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { sharesQueryKey, type BoardSharing } from './get-shares';

// Share a board with an email address:
//   'shared'  → that email already has an account: they have access right now
//   'invited' → no account yet: an invite that only that email can use was sent
export type SendInviteResult = BoardSharing & { status: 'shared' | 'invited' };

export async function sendInvite(boardId: string, email: string): Promise<SendInviteResult> {
  const response = await api.post<SendInviteResult>(`/boards/${boardId}/invites`, { email });
  return response.data;
}

export function useSendInvite(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => sendInvite(boardId, email),
    // The reply already carries the updated lists, so the dialog needs no second request
    onSuccess: (result) =>
      queryClient.setQueryData<BoardSharing>(sharesQueryKey(boardId), {
        shares: result.shares,
        invites: result.invites,
        inviteLink: result.inviteLink,
      }),
  });
}
