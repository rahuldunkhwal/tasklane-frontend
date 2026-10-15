import { Outlet } from 'react-router';

// Shared frame for the 4 auth pages: app name on top and the page centred.
// max-w-sm keeps the form narrow on desktop; w-full + p-4 make it fill a phone screen.
export function AuthLayout() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/40 p-4">
      <p className="text-xl font-semibold tracking-tight">Task Board</p>
      <div className="w-full max-w-sm">
        {/* The matching child route (login, signup, ...) is rendered here */}
        <Outlet />
      </div>
    </main>
  );
}
