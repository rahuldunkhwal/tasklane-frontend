import { Navigate, Outlet, useLocation } from 'react-router';
import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
import { getErrorMessage } from '@/lib/api-client';
import { useMe } from '../api/get-me';

// Doorman for pages that need a logged-in user (Home, Profile)
export function ProtectedRoute() {
  const me = useMe();
  const location = useLocation();

  // 1. Still asking the server "who is logged in?"
  if (me.isPending) return <PageLoader />;

  // 2. Couldn't ask at all (server down, network error)
  if (me.isError) {
    return <PageError message={getErrorMessage(me.error)} onRetry={() => void me.refetch()} />;
  }

  // 3. Nobody is logged in → go to /login, and remember where they wanted to go
  //    (replace: the protected URL doesn't stay in the Back-button history)
  if (!me.data) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // 4. Logged in → show the page
  return <Outlet />;
}
