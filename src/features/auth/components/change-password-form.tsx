import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FormErrorAlert } from '@/components/form-error-alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { getApiError, getErrorMessage } from '@/lib/api-client';
import { useChangePassword } from '../api/change-password';
import { changePasswordSchema, type ChangePasswordInput } from '../schemas';

const EMPTY = { currentPassword: '', newPassword: '', confirmPassword: '' };

export function ChangePasswordForm() {
  const changePassword = useChangePassword();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: EMPTY,
  });

  const onSubmit = handleSubmit((values) =>
    changePassword.mutate(values, {
      onSuccess: (message) => {
        reset(EMPTY); // never leave passwords sitting in the form
        toast.success('Password changed', { description: message });
      },
      onError: (error) => {
        // A wrong current password belongs under that field, not in the red box
        const apiError = getApiError(error);
        if (apiError?.code === 'INVALID_CURRENT_PASSWORD') {
          setError('currentPassword', { message: apiError.message }, { shouldFocus: true });
        }
      },
    }),
  );

  const wrongCurrent = getApiError(changePassword.error)?.code === 'INVALID_CURRENT_PASSWORD';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>
          You'll stay logged in here; your other devices will be logged out.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} noValidate>
          <FieldGroup>
            {changePassword.isError && !wrongCurrent && (
              <FormErrorAlert message={getErrorMessage(changePassword.error)} />
            )}

            <Field data-invalid={!!errors.currentPassword}>
              <FieldLabel htmlFor="current-password">Current password</FieldLabel>
              <Input
                id="current-password"
                type="password"
                placeholder="Enter your current password"
                autoComplete="current-password"
                aria-invalid={!!errors.currentPassword}
                {...register('currentPassword')}
              />
              <FieldError errors={[errors.currentPassword]} />
            </Field>

            <Field data-invalid={!!errors.newPassword}>
              <FieldLabel htmlFor="new-password">New password</FieldLabel>
              <Input
                id="new-password"
                type="password"
                placeholder="Create a new password"
                autoComplete="new-password"
                aria-invalid={!!errors.newPassword}
                {...register('newPassword')}
              />
              {errors.newPassword ? (
                <FieldError errors={[errors.newPassword]} />
              ) : (
                <FieldDescription>
                  At least 8 characters, with a letter and a number.
                </FieldDescription>
              )}
            </Field>

            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel htmlFor="confirm-new-password">Confirm new password</FieldLabel>
              <Input
                id="confirm-new-password"
                type="password"
                placeholder="Type the new password again"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                {...register('confirmPassword')}
              />
              <FieldError errors={[errors.confirmPassword]} />
            </Field>

            <div>
              <Button type="submit" disabled={changePassword.isPending}>
                {changePassword.isPending && <Spinner />}
                {changePassword.isPending ? 'Changing…' : 'Change password'}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
