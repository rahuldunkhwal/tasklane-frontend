import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

// Email the board's invite link to an address (used when that email has no account yet).
export async function sendInvite(boardId: string, email: string): Promise<string> {
  const response = await api.post<{ message: string }>(`/boards/${boardId}/invites`, { email });
  return response.data.message;
}

export function useSendInvite(boardId: string) {
  return useMutation({ mutationFn: (email: string) => sendInvite(boardId, email) });
}
