import { Link, NavLink, Outlet } from 'react-router';
import { Button } from '@/components/ui/button';
import { useMe } from '@/features/auth/api/get-me';
import { useLogout } from '@/features/auth/api/logout';

// Frame for every logged-in page: top bar + the page below.
// It lives in app/ (not components/) because it uses the auth feature,
// and only the app layer may import features (imports flow shared → features → app).
export function AppLayout() {
  const { data: user } = useMe(); // ProtectedRoute already made sure someone is logged in
  const logout = useLogout();

  // NavLink knows when its URL is the current page, so the active link can look different
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-1.5 text-sm ${isActive ? 'bg-muted font-medium' : 'text-muted-foreground hover:text-foreground'}`;

  return (
    <div className="min-h-svh bg-muted/40">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:gap-4">
          <Link to="/" className="font-semibold tracking-tight">
            Task Board
          </Link>
          <nav className="flex gap-1">
            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>
            <NavLink to="/profile" className={navClass}>
              Profile
            </NavLink>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            {/* The name is hidden on small phones to keep the bar on one line */}
            <span className="hidden text-sm text-muted-foreground sm:inline">{user?.name}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              {logout.isPending ? 'Logging out…' : 'Log out'}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
