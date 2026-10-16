import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { sharesQueryKey } from './get-shares';

// Withdraw a pending emailed invite: its link stops working
export async function removeInvite(boardId: string, email: string) {
  await api.delete(`/boards/${boardId}/invites/${encodeURIComponent(email)}`);
}

export function useRemoveInvite(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => removeInvite(boardId, email),
    // After success OR failure (e.g. already accepted meanwhile), reload the lists
    onSettled: () => queryClient.invalidateQueries({ queryKey: sharesQueryKey(boardId) }),
  });
}
