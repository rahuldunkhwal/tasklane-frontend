import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheckIcon, TriangleAlertIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
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
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { getApiError, getErrorMessage } from '@/lib/api-client';
import { useResetPassword } from '../api/reset-password';
import { resetPasswordSchema, type ResetPasswordInput } from '../schemas';
import { PasswordInput } from './password-input';

// token comes from the email link (/reset-password?token=...); null if the link has no token
export function ResetPasswordForm({ token }: { token: string | null }) {
  const resetPassword = useResetPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  if (!token) return <InvalidLink />;

  if (resetPassword.isSuccess) {
    return (
      <Card>
        <CardHeader>
          <CircleCheckIcon className="size-6 text-muted-foreground" />
          <CardTitle>Password updated</CardTitle>
          <CardDescription>{resetPassword.data}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link to="/login">Go to log in</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const onSubmit = handleSubmit(({ password }) => resetPassword.mutate({ token, password }));
  const linkExpired = getApiError(resetPassword.error)?.code === 'INVALID_RESET_TOKEN';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose a new password</CardTitle>
        <CardDescription>After this, you'll be logged out on all your devices.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} noValidate>
          <FieldGroup>
            {resetPassword.isError && (
              <div className="flex flex-col gap-2">
                <FormErrorAlert message={getErrorMessage(resetPassword.error)} />
                {linkExpired && (
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium underline underline-offset-4"
                  >
                    Request a new link
                  </Link>
                )}
              </div>
            )}

            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">New password</FieldLabel>
              <PasswordInput
                id="password"
                placeholder="Create a new password"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                {...register('password')}
              />
              {errors.password ? (
                <FieldError errors={[errors.password]} />
              ) : (
                <FieldDescription>
                  At least 8 characters, with a letter and a number.
                </FieldDescription>
              )}
            </Field>

            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel htmlFor="confirmPassword">Confirm new password</FieldLabel>
              <PasswordInput
                id="confirmPassword"
                placeholder="Type the password again"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                {...register('confirmPassword')}
              />
              <FieldError errors={[errors.confirmPassword]} />
            </Field>

            <Button type="submit" disabled={resetPassword.isPending}>
              {resetPassword.isPending && <Spinner />}
              {resetPassword.isPending ? 'Saving…' : 'Reset password'}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="justify-center text-sm">
        <Link to="/login" className="font-medium underline underline-offset-4">
          Back to log in
        </Link>
      </CardFooter>
    </Card>
  );
}

// Opened /reset-password without a token (e.g. a broken or copied-wrong link)
function InvalidLink() {
  return (
    <Card>
      <CardHeader>
        <TriangleAlertIcon className="size-6 text-muted-foreground" />
        <CardTitle>This link is invalid</CardTitle>
        <CardDescription>
          The reset link is missing or incomplete. Request a new one and use the latest email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link to="/forgot-password">Request a new link</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
