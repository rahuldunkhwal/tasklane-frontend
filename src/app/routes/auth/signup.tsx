import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Placeholder: the real signup form arrives in Step 3
export function SignupRoute() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>The signup form comes in Step 3.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm">
        <Link to="/login" className="underline">
          Go to log in
        </Link>
      </CardContent>
    </Card>
  );
}
