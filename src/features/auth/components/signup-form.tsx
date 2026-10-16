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
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { getApiError, getErrorMessage } from '@/lib/api-client';
import { useSignup } from '../api/signup';
import { signupSchema, type SignupInput } from '../schemas';
import { PasswordInput } from './password-input';

export function SignupForm() {
  const signup = useSignup();
  const location = useLocation();
  const [params] = useSearchParams();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    // Pre-fill the email when arriving from an invite link (?email=...)
    defaultValues: {
      name: '',
      email: params.get('email') ?? '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit((values) =>
    signup.mutate(values, {
      onError: (error) => {
        // "Email already taken" belongs under the email field, not in the red box at the top
        const apiError = getApiError(error);
        if (apiError?.code === 'EMAIL_TAKEN') {
          setError('email', { message: apiError.message }, { shouldFocus: true });
        }
      },
    }),
  );

  const emailTaken = getApiError(signup.error)?.code === 'EMAIL_TAKEN';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Start organising your tasks in a minute.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} noValidate>
          <FieldGroup>
            {signup.isError && !emailTaken && (
              <FormErrorAlert message={getErrorMessage(signup.error)} />
            )}

            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                placeholder="Your name"
                autoComplete="name"
                aria-invalid={!!errors.name}
                {...register('name')}
              />
              <FieldError errors={[errors.name]} />
            </Field>

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

            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <PasswordInput
                id="password"
                placeholder="Create a password"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                {...register('password', { deps: ['confirmPassword'] })}
              />
              {/* Show the rules up front; once there's an error, show the error instead */}
              {errors.password ? (
                <FieldError errors={[errors.password]} />
              ) : (
                <FieldDescription>
                  At least 8 characters, with a letter and a number.
                </FieldDescription>
              )}
            </Field>

            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
              <PasswordInput
                id="confirmPassword"
                placeholder="Type the password again"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                {...register('confirmPassword')}
              />
              <FieldError errors={[errors.confirmPassword]} />
            </Field>

            <Button type="submit" disabled={signup.isPending}>
              {signup.isPending && <Spinner />}
              {signup.isPending ? 'Creating account…' : 'Create account'}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="justify-center gap-1 text-sm">
        Already have an account?
        {/* Keep the invite's email/redirect params when switching to log in */}
        <Link to={`/login${location.search}`} className="font-medium underline underline-offset-4">
          Log in
        </Link>
      </CardFooter>
    </Card>
  );
}
