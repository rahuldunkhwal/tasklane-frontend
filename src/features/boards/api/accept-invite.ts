import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

// The logged-in user joins the board the link points to (becomes a viewer).
export async function acceptInvite(token: string): Promise<{ boardId: string }> {
  const response = await api.post<{ boardId: string }>(`/invites/${token}/accept`);
  return response.data;
}

export function useAcceptInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptInvite,
    // The newly-joined board (and its tasks) should now appear everywhere
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
