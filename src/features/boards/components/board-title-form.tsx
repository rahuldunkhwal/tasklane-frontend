import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormErrorAlert } from '@/components/form-error-alert';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { getErrorMessage } from '@/lib/api-client';
import { boardTitleSchema, type BoardTitleInput } from '../schemas';

type BoardTitleFormProps = {
  defaultTitle?: string;
  submitLabel: string; // e.g. "Create board"
  pendingLabel: string; // e.g. "Creating…"
  isPending: boolean;
  error: unknown; // the mutation's error, if the last attempt failed
  onSubmit: (title: string) => void;
};

// The same form for "New board" and "Rename board": one title field + Cancel / Save.
// It lives inside a dialog, which unmounts it when closed, so every opening starts fresh.
export function BoardTitleForm({
  defaultTitle = '',
  submitLabel,
  pendingLabel,
  isPending,
  error,
  onSubmit,
}: BoardTitleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BoardTitleInput>({
    resolver: zodResolver(boardTitleSchema),
    defaultValues: { title: defaultTitle },
  });

  return (
    <form onSubmit={handleSubmit(({ title }) => onSubmit(title))} noValidate>
      <FieldGroup>
        {error !== null && <FormErrorAlert message={getErrorMessage(error)} />}

        <Field data-invalid={!!errors.title}>
          <FieldLabel htmlFor="board-title">Title</FieldLabel>
          <Input
            id="board-title"
            placeholder="e.g. Shopping, Work, Ideas"
            autoComplete="off"
            autoFocus
            aria-invalid={!!errors.title}
            {...register('title')}
          />
          <FieldError errors={[errors.title]} />
        </Field>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner />}
            {isPending ? pendingLabel : submitLabel}
          </Button>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
