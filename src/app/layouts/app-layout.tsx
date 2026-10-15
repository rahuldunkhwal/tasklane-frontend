import { ChevronDownIcon, LayoutDashboardIcon, LayoutGridIcon, LogOutIcon, UserIcon } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TasklaneLogo } from '@/components/tasklane-logo';
import { UserAvatar } from '@/components/user-avatar';
import { useLogout } from '@/features/auth/api/logout';
import { useMe } from '@/features/auth/api/get-me';

// Shared container so the navbar and the page content line up on the same 1280px grid.
export const appContainer = 'mx-auto w-full max-w-[1280px] px-4 sm:px-6';

// Profile isn't a tab — it's reached from the avatar menu.
const TABS = [
  { to: '/', label: 'Home', icon: LayoutDashboardIcon, end: true },
  { to: '/boards', label: 'Boards', icon: LayoutGridIcon, end: false },
];

export function AppLayout() {
  const { data: user } = useMe(); // ProtectedRoute already made sure someone is logged in
  const logout = useLogout();

  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
      isActive ? 'bg-brand-tint text-brand-strong' : 'text-ink-muted hover:bg-sunken hover:text-foreground'
    }`;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-30 h-14 shrink-0 border-b bg-surface sm:h-16">
        <div className={`${appContainer} flex h-full items-center gap-2 sm:gap-4`}>
          <Link to="/" aria-label="Tasklane home">
            <TasklaneLogo />
          </Link>

          {/* Desktop tabs; on mobile they live in the bottom bar */}
          <nav className="hidden gap-1 sm:flex">
            {TABS.map((tab) => (
              <NavLink key={tab.to} to={tab.to} end={tab.end} className={tabClass}>
                {tab.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-2 rounded-full border bg-surface py-1 pr-2.5 pl-1 outline-none transition-colors hover:bg-sunken focus-visible:ring-3 focus-visible:ring-ring/50"
                aria-label="Account menu"
              >
                <UserAvatar name={user?.name} avatarUrl={user?.avatarUrl} className="size-8 text-sm" />
                <span className="hidden text-[13px] font-semibold sm:inline">
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDownIcon className="hidden size-4 text-ink-muted sm:block" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-62 rounded-2xl p-2">
                <div className="px-2 py-1.5">
                  <p className="truncate text-sm font-semibold">{user?.name}</p>
                  <p className="truncate text-xs text-ink-muted">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="rounded-xl py-2">
                  <Link to="/profile">
                    <UserIcon />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-xl py-2"
                  onSelect={() => logout.mutate()}
                  disabled={logout.isPending}
                >
                  <LogOutIcon />
                  {logout.isPending ? 'Logging out…' : 'Log out'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 pb-[68px] sm:pb-0">
        <Outlet />
      </main>

      {/* Mobile bottom tab bar (desktop uses the top tabs) */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex h-[68px] border-t bg-surface sm:hidden"
        aria-label="Main"
      >
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className="flex flex-1 flex-col items-center justify-center gap-1 text-xs font-semibold text-ink-muted"
          >
            {({ isActive }) => (
              <>
                <span
                  className={`grid h-7 w-12 place-items-center rounded-full ${isActive ? 'bg-brand-tint text-brand-strong' : ''}`}
                >
                  <tab.icon className="size-5" />
                </span>
                <span className={isActive ? 'text-brand-strong' : ''}>{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
