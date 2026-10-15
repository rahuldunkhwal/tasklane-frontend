import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { User } from '@/types/api';
import { meQueryKey } from './get-me';

// Upload a new profile photo. axios sets the multipart boundary automatically for FormData.
export async function uploadAvatar(file: File): Promise<User> {
  const form = new FormData();
  form.append('avatar', file);
  const response = await api.post<{ user: User }>('/users/me/avatar', form);
  return response.data.user;
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (user) => queryClient.setQueryData(meQueryKey, user),
  });
}
