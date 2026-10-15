import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { User } from '@/types/api';
import type { LoginInput } from '../schemas';
import { meQueryKey } from './get-me';

export async function login(input: LoginInput): Promise<User> {
  const response = await api.post<{ user: User }>('/auth/login', input);
  return response.data.user;
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    // Save the user as "who is logged in". PublicOnlyRoute sees it and redirects to Home
    // (or to the page the user originally wanted), so the form doesn't navigate itself.
    onSuccess: (user) => queryClient.setQueryData(meQueryKey, user),
  });
}
