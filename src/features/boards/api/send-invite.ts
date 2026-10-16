import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { sharesQueryKey, type BoardSharing } from './get-shares';

// Invite an email address to a board. Nobody gets access until they ACCEPT the emailed invite
// (logged in with that exact email) — until then the address is listed as pending.
export async function sendInvite(boardId: string, email: string): Promise<BoardSharing> {
  const response = await api.post<BoardSharing>(`/boards/${boardId}/invites`, { email });
  return response.data;
}

export function useSendInvite(boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => sendInvite(boardId, email),
    // The reply already carries the updated lists, so the dialog needs no second request
    onSuccess: (sharing) => queryClient.setQueryData<BoardSharing>(sharesQueryKey(boardId), sharing),
  });
}
