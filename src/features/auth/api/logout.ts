import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { meQueryKey } from './get-me';

export async function logout() {
  await api.post('/auth/logout');
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // "Nobody is logged in" → ProtectedRoute notices and sends the user to /login.
      // (When boards and tasks exist, their cached data will be cleared here too.)
      queryClient.setQueryData(meQueryKey, null);
    },
  });
}
