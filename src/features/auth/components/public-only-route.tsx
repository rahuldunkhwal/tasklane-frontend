import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router';
import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
import { getErrorMessage } from '@/lib/api-client';
import { useMe } from '../api/get-me';

// Only an internal path is a safe redirect target ("/..." but not "//host", which would be off-site)
function safePath(value: string | null): string | null {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : null;
}

// Doorman for pages only logged-OUT users need (login, signup, forgot password)
export function PublicOnlyRoute() {
  const me = useMe();
  const location = useLocation();
  const [params] = useSearchParams();

  if (me.isPending) return <PageLoader />;

  if (me.isError) {
    return <PageError message={getErrorMessage(me.error)} onRetry={() => void me.refetch()} />;
  }

  // Already logged in → go to ?redirect= (e.g. back to an invite), or the page ProtectedRoute
  // saved, or Home. This also runs right after login/signup: the "me" answer becomes a user,
  // this component re-renders and redirects. The forms don't navigate themselves.
  if (me.data) {
    const from =
      safePath(params.get('redirect')) ?? (location.state as { from?: string } | null)?.from ?? '/';
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}
