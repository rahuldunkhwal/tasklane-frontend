import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

// Placeholder: update name, profile picture and change password come in a later phase
export function ProfileRoute() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-4 p-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <p className="text-muted-foreground">Coming in a later phase.</p>
      <div>
        <Button asChild variant="outline">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </main>
  );
}
