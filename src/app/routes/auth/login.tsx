import { LoginForm } from '@/features/auth/components/login-form';

// Thin page: the form lives in the auth feature; this file only connects it to the /login URL
export function LoginRoute() {
  return <LoginForm />;
}
