import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { ChangePasswordInput } from '../schemas';

// confirmPassword is only for the form: send the API just what it needs
export async function changePassword({
  currentPassword,
  newPassword,
}: ChangePasswordInput): Promise<string> {
  const response = await api.post<{ message: string }>('/auth/change-password', {
    currentPassword,
    newPassword,
  });
  return response.data.message;
}

// This browser stays logged in (the server only ends the OTHER sessions), so no cache changes
export function useChangePassword() {
  return useMutation({ mutationFn: changePassword });
}
