import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { meQueryKey } from '@/features/auth/api/get-me';
import { setUnauthorizedHandler } from '@/lib/api-client';
import { queryClient } from '@/lib/react-query';

// Any 401 from the API (e.g. the session expired or was ended elsewhere) means
// "nobody is logged in" → ProtectedRoute then sends the user to /login.
setUnauthorizedHandler(() => queryClient.setQueryData(meQueryKey, null));

// Everything the whole app needs around it (later also: toast notifications)
export function AppProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
