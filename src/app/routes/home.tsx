import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { useMe } from '@/features/auth/api/get-me';
import { useLogout } from '@/features/auth/api/logout';
import { getErrorMessage } from '@/lib/api-client';

// Placeholder: later this page combines boards, tasks and the dashboard
export function HomeRoute() {
  const { data: user } = useMe(); // ProtectedRoute already made sure someone is logged in
  const logout = useLogout();

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-4 p-4">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Hello, {user?.name}</h1>
        <Button variant="outline" onClick={() => logout.mutate()} disabled={logout.isPending}>
          {logout.isPending ? 'Logging out…' : 'Log out'}
        </Button>
      </header>

      {logout.isError && (
        <p className="text-sm text-destructive">{getErrorMessage(logout.error)}</p>
      )}

      <p className="text-muted-foreground">Boards and tasks will appear here.</p>
      <div>
        <Button asChild variant="secondary">
          <Link to="/profile">Profile</Link>
        </Button>
      </div>
    </main>
  );
}
