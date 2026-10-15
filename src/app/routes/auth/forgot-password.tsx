import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Placeholder: the real form arrives in Step 4
export function ForgotPasswordRoute() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot password</CardTitle>
        <CardDescription>The forgot password form comes in Step 4.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm">
        <Link to="/login" className="underline">
          Back to log in
        </Link>
      </CardContent>
    </Card>
  );
}
