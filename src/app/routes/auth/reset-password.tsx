import { useSearchParams } from 'react-router';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

// The email link looks like /reset-password?token=abc..., so the page reads the token from the URL
// and hands it to the form (reading the URL is the page's job; the form just receives the token).
export function ResetPasswordRoute() {
  const [searchParams] = useSearchParams();
  return <ResetPasswordForm token={searchParams.get('token')} />;
}
