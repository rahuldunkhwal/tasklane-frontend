import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { clearUserData } from './get-me';

export async function logout() {
  await api.post('/auth/logout');
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    // "Nobody is logged in" → ProtectedRoute sends the user to /login; cached boards are forgotten
    onSuccess: () => clearUserData(queryClient),
  });
}
