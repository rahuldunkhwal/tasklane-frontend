import { QueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

// The cache that remembers every answer from the API (shared by the whole app)
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry once for network hiccups and server errors (5xx), but never for 4xx:
      // "not logged in" or "not found" won't change by asking again.
      retry: (failureCount, error) => {
        if (isAxiosError(error) && error.response && error.response.status < 500) return false;
        return failureCount < 1;
      },
    },
  },
});
