import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { clearUserData } from '@/features/auth/api/get-me';
import { setUnauthorizedHandler } from '@/lib/api-client';
import { queryClient } from '@/lib/react-query';

// Any 401 from the API (e.g. the session expired or was ended elsewhere) means
// "nobody is logged in" → ProtectedRoute then sends the user to /login.
setUnauthorizedHandler(() => clearUserData(queryClient));

// Everything the whole app needs around it
export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Toast messages (e.g. "Password changed", "Couldn't update the task").
          richColors = red for errors; success uses the lime palette via the tokens below. */}
      <Toaster
        richColors
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: 'rounded-full! font-semibold!',
            success: 'bg-success-tint! text-success! border-success-tint!',
          },
        }}
      />
    </QueryClientProvider>
  );
}
