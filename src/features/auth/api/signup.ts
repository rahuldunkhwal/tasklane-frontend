import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { User } from '@/types/api';
import type { SignupInput } from '../schemas';
import { meQueryKey } from './get-me';

// confirmPassword is only for the form: send the API just what it needs
export async function signup({ name, email, password }: SignupInput): Promise<User> {
  const response = await api.post<{ user: User }>('/auth/signup', { name, email, password });
  return response.data.user;
}

export function useSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signup,
    // The backend logs a new user in straight away (it sets the cookie), so we do the same here
    onSuccess: (user) => queryClient.setQueryData(meQueryKey, user),
  });
}
