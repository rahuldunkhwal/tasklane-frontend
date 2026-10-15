import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

// Public info shown on the invite landing page (no login needed).
export type InviteInfo = { boardTitle: string; inviterName: string };

export async function getInviteInfo(token: string): Promise<InviteInfo> {
  const response = await api.get<InviteInfo>(`/invites/${token}`);
  return response.data;
}

export function useInviteInfo(token: string) {
  return useQuery({
    queryKey: ['invite', token],
    queryFn: () => getInviteInfo(token),
    retry: false, // a 404 (bad token) shouldn't be retried
  });
}
