import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { User } from '@/types/api';
import { meQueryKey } from './get-me';

// Update the logged-in user's display name.
export async function updateName(name: string): Promise<User> {
  const response = await api.patch<{ user: User }>('/users/me', { name });
  return response.data.user;
}

export function useUpdateName() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateName,
    onSuccess: (user) => queryClient.setQueryData(meQueryKey, user),
  });
}
