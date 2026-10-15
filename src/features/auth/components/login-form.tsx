import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useSearchParams } from 'react-router';
import { FormErrorAlert } from '@/components/form-error-alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { getErrorMessage } from '@/lib/api-client';
import { useLogin } from '../api/login';
import { loginSchema, type LoginInput } from '../schemas';
import { PasswordInput } from './password-input';

export function LoginForm() {
  const login = useLogin();
  const location = useLocation();
  const [params] = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    // Pre-fill the email when arriving from an invite link (?email=...)
    defaultValues: { email: params.get('email') ?? '', password: '' },
  });

  // handleSubmit checks the zod rules first: login.mutate only runs if every field is valid
  const onSubmit = handleSubmit((values) => login.mutate(values));

  return (
    <Card className="rounded-[28px]">
      <CardHeader>
        <CardTitle className="text-[26px] font-bold">Welcome back</CardTitle>
        <CardDescription>Enter your email and password to continue.</CardDescription>
      </CardHeader>

      <CardContent>
        {/* noValidate: turn off the browser's own popups so our messages are shown consistently */}
        <form onSubmit={onSubmit} noValidate>
          <FieldGroup>
            {/* Errors that don't belong to one field, e.g. "Invalid email or password" */}
            {login.isError && <FormErrorAlert message={getErrorMessage(login.error)} />}

            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                autoFocus
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              <FieldError errors={[errors.email]} />
            </Field>

            <Field data-invalid={!!errors.password}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Link
                  to="/forgot-password"
                  className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                id="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register('password')}
              />
              <FieldError errors={[errors.password]} />
            </Field>

            {/* Disabled while waiting, so a double click can't send the request twice */}
            <Button type="submit" disabled={login.isPending}>
              {login.isPending && <Spinner />}
              {login.isPending ? 'Logging in…' : 'Log in'}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="justify-center gap-1 text-sm">
        No account?
        {/* Keep the invite's email/redirect params when switching to sign up */}
        <Link to={`/signup${location.search}`} className="font-medium underline underline-offset-4">
          Sign up
        </Link>
      </CardFooter>
    </Card>
  );
}
