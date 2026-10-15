import { Navigate, Outlet, useLocation } from 'react-router';
import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
import { getErrorMessage } from '@/lib/api-client';
import { useMe } from '../api/get-me';

// Doorman for pages only logged-OUT users need (login, signup, forgot password)
export function PublicOnlyRoute() {
  const me = useMe();
  const location = useLocation();

  if (me.isPending) return <PageLoader />;

  if (me.isError) {
    return <PageError message={getErrorMessage(me.error)} onRetry={() => void me.refetch()} />;
  }

  // Already logged in → go to the page they originally wanted (saved by ProtectedRoute), or Home.
  // This is also what happens right after a successful login: the "me" answer changes to a user,
  // this component re-renders, and the user is redirected. The login form doesn't navigate itself.
  if (me.data) {
    const from = (location.state as { from?: string } | null)?.from ?? '/';
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}
