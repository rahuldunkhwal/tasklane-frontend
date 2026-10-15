import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Placeholder: the real login form arrives in Step 3
export function LoginRoute() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Log in</CardTitle>
        <CardDescription>The login form comes in Step 3.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        <Link to="/signup" className="underline">
          Go to sign up
        </Link>
        <Link to="/forgot-password" className="underline">
          Go to forgot password
        </Link>
        <Link to="/" className="underline">
          Go to home
        </Link>
      </CardContent>
    </Card>
  );
}
