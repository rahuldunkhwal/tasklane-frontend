import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

export function NotFoundRoute() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-4xl font-semibold">404</h1>
      <p className="text-muted-foreground">This page doesn't exist.</p>
      <Button asChild>
        <Link to="/">Go home</Link>
      </Button>
    </main>
  );
}
