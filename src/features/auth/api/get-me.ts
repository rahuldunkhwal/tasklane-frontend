import { useQuery, type QueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { api } from '@/lib/api-client';
import type { User } from '@/types/api';

// The name of this answer in TanStack Query's cache. Login/logout update it directly.
export const meQueryKey = ['auth', 'me'] as const;

// Who is logged in? Returns the user, or null when nobody is.
// A 401 here is a normal answer ("not logged in"), not an error.
export async function getMe(): Promise<User | null> {
  try {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data.user;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) return null;
    throw error; // server down, 500, ...: a real error
  }
}

// Used after logout, password reset, or an expired session: mark "nobody is logged in"
// (the guards then redirect) and forget everything cached for that user (boards, tasks, ...),
// so the next person on this browser never sees it, not even for a split second.
export function clearUserData(queryClient: QueryClient) {
  queryClient.setQueryData(meQueryKey, null);
  queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== 'auth' });
}

// Asked once when the app loads, then shared by every component that calls useMe()
export function useMe() {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: getMe,
    staleTime: 5 * 60 * 1000, // trust the answer for 5 minutes before asking the server again
  });
}
