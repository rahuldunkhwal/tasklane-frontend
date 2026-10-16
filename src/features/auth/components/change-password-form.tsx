import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon, CircleIcon } from 'lucide-react';
import { useForm, useWatch, type UseFormRegisterReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { FormErrorAlert } from '@/components/form-error-alert';
import { Button } from '@/components/ui/button';
import { getApiError, getErrorMessage } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { useChangePassword } from '../api/change-password';
import { changePasswordSchema, type ChangePasswordInput } from '../schemas';
import { PasswordInput } from './password-input';

const EMPTY = { currentPassword: '', newPassword: '', confirmPassword: '' };

export function ChangePasswordForm({ onSuccess }: { onSuccess?: () => void }) {
  const changePassword = useChangePassword();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors, isValid },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: EMPTY,
    mode: 'onChange', // so the live checklist and the enabled/disabled button update as you type
  });

  // useWatch (not watch()) subscribes cleanly and plays well with the React Compiler
  const newPassword = useWatch({ control, name: 'newPassword' }) ?? '';
  const rules = [
    { label: 'At least 8 characters', ok: newPassword.length >= 8 },
    { label: 'Contains a letter', ok: /[A-Za-z]/.test(newPassword) },
    { label: 'Contains a number', ok: /[0-9]/.test(newPassword) },
  ];

  const onSubmit = handleSubmit((values) =>
    changePassword.mutate(values, {
      onSuccess: (message) => {
        reset(EMPTY); // never leave passwords sitting in the form
        toast.success('Password changed', { description: message });
        onSuccess?.(); // e.g. close the dialog
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
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      {changePassword.isError && !wrongCurrent && (
        <FormErrorAlert message={getErrorMessage(changePassword.error)} />
      )}

      <PasswordField
        id="current-password"
        label="Current password"
        placeholder="Enter your current password"
        autoComplete="current-password"
        error={errors.currentPassword?.message}
        field={register('currentPassword')}
      />

      <div className="flex flex-col gap-2">
        <PasswordField
          id="new-password"
          label="New password"
          placeholder="Create a new password"
          autoComplete="new-password"
          error={errors.newPassword?.message}
          // deps: re-check the "passwords match" rule on Confirm whenever New changes,
          // so fixing a mismatch by editing New clears the stale error on Confirm.
          field={register('newPassword', { deps: ['confirmPassword'] })}
        />
        <ul className="flex flex-col gap-1 text-xs font-medium">
          {rules.map((rule) => (
            <li
              key={rule.label}
              className={cn(
                'flex items-center gap-1.5',
                rule.ok ? 'text-success' : 'text-ink-muted',
              )}
            >
              {rule.ok ? <CheckIcon className="size-3.5" /> : <CircleIcon className="size-3.5" />}
              {rule.label}
            </li>
          ))}
        </ul>
      </div>

      <PasswordField
        id="confirm-new-password"
        label="Confirm new password"
        placeholder="Type the new password again"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        field={register('confirmPassword')}
      />

      <div>
        <Button
          type="submit"
          disabled={!isValid || changePassword.isPending}
          className={cn(!isValid && 'bg-sunken text-ink-muted hover:bg-sunken')}
        >
          {changePassword.isPending ? 'Changing…' : 'Change password'}
        </Button>
      </div>
    </form>
  );
}

type PasswordFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  autoComplete: string;
  error?: string;
  field: UseFormRegisterReturn;
};

function PasswordField({ id, label, placeholder, autoComplete, error, field }: PasswordFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <PasswordInput
        id={id}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        {...field}
      />
      {error && (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
