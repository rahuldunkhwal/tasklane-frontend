import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { User } from '@/types/api';
import { meQueryKey } from './get-me';

// Remove the profile photo (also deletes it from Cloudinary server-side).
export async function removeAvatar(): Promise<User> {
  const response = await api.delete<{ user: User }>('/users/me/avatar');
  return response.data.user;
}

export function useRemoveAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeAvatar,
    onSuccess: (user) => queryClient.setQueryData(meQueryKey, user),
  });
}
