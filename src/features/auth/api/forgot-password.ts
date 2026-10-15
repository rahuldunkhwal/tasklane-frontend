import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { ForgotPasswordInput } from '../schemas';

// The backend answers with the same message whether or not the email has an account
export async function forgotPassword(input: ForgotPasswordInput): Promise<string> {
  const response = await api.post<{ message: string }>('/auth/forgot-password', input);
  return response.data.message;
}

export function useForgotPassword() {
  return useMutation({ mutationFn: forgotPassword });
}
