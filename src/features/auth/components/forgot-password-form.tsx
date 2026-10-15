import { zodResolver } from '@hookform/resolvers/zod';
import { MailCheckIcon } from 'lucide-react';
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
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { getErrorMessage } from '@/lib/api-client';
import { useForgotPassword } from '../api/forgot-password';
import { forgotPasswordSchema, type ForgotPasswordInput } from '../schemas';

export function ForgotPasswordForm() {
  const forgotPassword = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit((values) => forgotPassword.mutate(values));

  // After sending: the same screen whether or not the email has an account (like the backend)
  if (forgotPassword.isSuccess) {
    return (
      <Card>
        <CardHeader>
          <MailCheckIcon className="size-6 text-muted-foreground" />
          <CardTitle>Check your email</CardTitle>
          <CardDescription>{forgotPassword.data}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
          <p>
            The link is valid for 15 minutes. If you can't find the email, check your spam folder.
          </p>
          {/* reset() shows the form again; the typed email is still there */}
          <Button variant="outline" onClick={() => forgotPassword.reset()}>
            Send again
          </Button>
        </CardContent>
        <CardFooter className="justify-center text-sm">
          <Link to="/login" className="font-medium underline underline-offset-4">
            Back to log in
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot your password?</CardTitle>
        <CardDescription>Enter your email and we'll send you a link to reset it.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} noValidate>
          <FieldGroup>
            {forgotPassword.isError && (
              <FormErrorAlert message={getErrorMessage(forgotPassword.error)} />
            )}

            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              <FieldError errors={[errors.email]} />
            </Field>

            <Button type="submit" disabled={forgotPassword.isPending}>
              {forgotPassword.isPending && <Spinner />}
              {forgotPassword.isPending ? 'Sending…' : 'Send reset link'}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="justify-center gap-1 text-sm">
        Remembered it?
        <Link to="/login" className="font-medium underline underline-offset-4">
          Log in
        </Link>
      </CardFooter>
    </Card>
  );
}
