import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { clearUserData } from './get-me';

type ResetPasswordRequest = { token: string; password: string };

export async function resetPassword(input: ResetPasswordRequest): Promise<string> {
  const response = await api.post<{ message: string }>('/auth/reset-password', input);
  return response.data.message;
}

export function useResetPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetPassword,
    // The backend ended every session of this user (including this browser's), so nobody is logged in
    onSuccess: () => clearUserData(queryClient),
  });
}
