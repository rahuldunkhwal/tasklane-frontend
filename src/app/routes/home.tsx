import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

// Placeholder: later this page combines boards, tasks and the dashboard
export function HomeRoute() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-4 p-4">
      <h1 className="text-2xl font-semibold">Home</h1>
      <p className="text-muted-foreground">Protected page (the login guard is added in Step 2).</p>
      <div className="flex gap-2">
        <Button asChild>
          <Link to="/profile">Profile</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/login">Log in page</Link>
        </Button>
      </div>
    </main>
  );
}
