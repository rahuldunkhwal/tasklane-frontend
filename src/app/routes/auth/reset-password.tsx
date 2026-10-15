import { Link, useSearchParams } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Placeholder: the real form arrives in Step 4.
// The email link looks like /reset-password?token=abc..., so the token comes from the URL.
export function ResetPasswordRoute() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose a new password</CardTitle>
        <CardDescription>The reset form comes in Step 4.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        <p className="break-all">Token from the link: {token ?? '(none)'}</p>
        <Link to="/login" className="underline">
          Back to log in
        </Link>
      </CardContent>
    </Card>
  );
}
